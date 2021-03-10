import * as vscode from 'vscode';
import { AxiosResponse } from 'axios';
import * as FormData from 'form-data';
import * as fs from 'fs';
import { isCSARUploaded } from './helpers';

const axios = require('axios').default;

export let REST_API_ENDPOINT = 'https://template-library-radon.xlab.si/api';

interface RequestHeaders {
    [key: string]: any
}

export let JWT_BEARER_TOKEN: string;
export let COOKIES: string;
export const SUCCESSFULL_STATUS_CODES = [200, 201, 202];

export async function configureApiEndpoint(restApiEndpoint: string) {
    REST_API_ENDPOINT = restApiEndpoint;
}

export async function addInterceptors() {
    await axios.interceptors.request.use((request: any) => {
        console.log('Starting Request', request);
        return request;
    });

    await axios.interceptors.response.use((response: any) => {
        console.log('Response:', response);
        return response;
    });
}

export async function getCurrentUser(): Promise<AxiosResponse<any> | null> {
    await addInterceptors();
    let httpResponse: AxiosResponse<any> | null = null;

    let requestHeaders: RequestHeaders = {};
    if (JWT_BEARER_TOKEN) {
        requestHeaders['Authorization'] = `Bearer ${JWT_BEARER_TOKEN}`;
    }
    if (COOKIES) {
        requestHeaders['cookie'] = COOKIES;
    }

    await axios.get(REST_API_ENDPOINT + '/users/current', { headers: requestHeaders, timeout: 5000 })
        .then(function (response: AxiosResponse<any> | null) {
            console.log(response);
            httpResponse = response;
        })
        .catch(function (error: any) {
            if (error.code === 'ECONNABORTED') {
                httpResponse = null;
            } else {
                console.log(error);
                httpResponse = error;
            }
        });

    return httpResponse;
}

export async function postNativeLogin(username: string, password: string): Promise<AxiosResponse<any> | null> {
    let httpResponse: AxiosResponse<any> | null = null;

    const user = JSON.stringify({
        "username": username,
        "password": password
    });

    let requestHeaders: RequestHeaders = { 'Content-Type': 'application/json' };

    await axios.post(REST_API_ENDPOINT + '/auth/login', user, { headers: requestHeaders })
        .then(function (response: AxiosResponse<any>) {
            console.log(response);
            JWT_BEARER_TOKEN = response.data.token;
            httpResponse = response;
        }).catch(function (error: any) {
            console.log(error);
            if (error.response) {
                httpResponse = error.response;
            } else if (error.request) {
                httpResponse = error.request;
            } else {
                httpResponse = error;
            }
        });

    return httpResponse;
}

export async function getTemplates(): Promise<AxiosResponse<any> | null> {
    let httpResponse: AxiosResponse<any> | null = null;

    let requestHeaders: RequestHeaders = {};
    if (JWT_BEARER_TOKEN) {
        requestHeaders['Authorization'] = `Bearer ${JWT_BEARER_TOKEN}`;
    }
    if (COOKIES) {
        requestHeaders['cookie'] = COOKIES;
    }

    await axios.get(REST_API_ENDPOINT + '/templates', { headers: requestHeaders })
        .then(function (response: AxiosResponse<any>) {
            console.log(response);
            httpResponse = response;
        })
        .catch(function (error: any) {
            console.log(error);
            if (error.response) {
                httpResponse = error.response;
            } else if (error.request) {
                httpResponse = error.request;
            } else {
                httpResponse = error;
            }
        });

    return httpResponse;
}

export async function getTemplateTypes(): Promise<AxiosResponse<any> | null> {
    let httpResponse: AxiosResponse<any> | null = null;

    let requestHeaders: RequestHeaders = {};
    if (JWT_BEARER_TOKEN) {
        requestHeaders['Authorization'] = `Bearer ${JWT_BEARER_TOKEN}`;
    }
    if (COOKIES) {
        requestHeaders['cookie'] = COOKIES;
    }

    await axios.get(REST_API_ENDPOINT + '/template_types', { headers: requestHeaders })
        .then(function (response: AxiosResponse<any>) {
            console.log(response);
            httpResponse = response;
        })
        .catch(function (error: any) {
            console.log(error);
            if (error.response) {
                httpResponse = error.response;
            } else if (error.request) {
                httpResponse = error.request;
            } else {
                httpResponse = error;
            }
        });

    return httpResponse;
}

export async function getTemplateVersions(templateName: string): Promise<AxiosResponse<any> | null> {
    let httpResponse: AxiosResponse<any> | null = null;

    let requestHeaders: RequestHeaders = {};
    if (JWT_BEARER_TOKEN) {
        requestHeaders['Authorization'] = `Bearer ${JWT_BEARER_TOKEN}`;
    }
    if (COOKIES) {
        requestHeaders['cookie'] = COOKIES;
    }

    await axios.get(REST_API_ENDPOINT + `/templates/${templateName}/versions`, { headers: requestHeaders })
        .then(function (response: AxiosResponse<any>) {
            console.log(response);
            httpResponse = response;
        })
        .catch(function (error: any) {
            console.log(error);
            if (error.response) {
                httpResponse = error.response;
            } else if (error.request) {
                httpResponse = error.request;
            } else {
                httpResponse = error;
            }
        });

    return httpResponse;
}

export async function getTemplateVersionFiles(templateName: string, versionName: string, destination: string): Promise<AxiosResponse<any> | null> {
    let httpResponse: AxiosResponse<any> | null = null;

    let requestHeaders: RequestHeaders = {};
    if (JWT_BEARER_TOKEN) {
        requestHeaders['Authorization'] = `Bearer ${JWT_BEARER_TOKEN}`;
    }
    if (COOKIES) {
        requestHeaders['cookie'] = COOKIES;
    }

    await axios.get(REST_API_ENDPOINT + `/templates/${templateName}/versions/${versionName}/files`, { headers: requestHeaders, responseType: 'arraybuffer', timeout: 10000, })
        .then(function (response: AxiosResponse<any>) {
            console.log(response);
            httpResponse = response;

            fs.writeFile(destination, response.data, (err) => {
                if (err) {
                    throw err;
                }
                console.log('The file has been saved!');
            });
        })
        .catch(function (error: any) {
            console.log(error);
            if (error.response) {
                httpResponse = error.response;
            } else if (error.request) {
                httpResponse = error.request;
            } else {
                httpResponse = error;
            }
        });

    return httpResponse;
}

export async function postTemplate(name: string, description: string, templateTypeName: string, publicAccess: boolean): Promise<AxiosResponse<any> | null> {
    let httpResponse: AxiosResponse<any> | null = null;
    console.log("Sono qui");

    const template = JSON.stringify({
        "name": name,
        "description": description,
        "template_type_name": templateTypeName,
        "public_access": publicAccess
    });

    let requestHeaders: RequestHeaders = { 'Content-Type': 'application/json' };

    requestHeaders['Accept'] = 'text/plain';

    if (JWT_BEARER_TOKEN) {
        requestHeaders['Authorization'] = `Bearer ${JWT_BEARER_TOKEN}`;
    }
    if (COOKIES) {
        requestHeaders['cookie'] = COOKIES;
    }

    console.log(requestHeaders);

    await axios.post(REST_API_ENDPOINT + '/templates', template, { headers: requestHeaders })
        .then(function (response: AxiosResponse<any>) {
            console.log(response);
            httpResponse = response;
        }).catch(function (error: any) {
            console.log(error);
            if (error.response) {
                httpResponse = error.response;
            } else if (error.request) {
                httpResponse = error.request;
            } else {
                httpResponse = error;
            }
        });

    return httpResponse;
}

export async function postVersion(templateName: string, versionName: string, templateFile: string, readmeFile?: string, implementationFiles?: string[]): Promise<AxiosResponse<any> | null> {
    let httpResponse: AxiosResponse<any> | null = null;
    const form = new FormData();

    form.append('version_name', versionName);

    if (readmeFile) {
        form.append('readme_file', fs.createReadStream(readmeFile));
    }

    form.append('template_file', fs.createReadStream(templateFile));

    if (implementationFiles) {
        console.log(implementationFiles);
        for (let file of implementationFiles) {
            console.log(file);
            form.append('implementation_file', fs.createReadStream(file));
        }
    }
    //form.append('maxContentLength','Infinity');
    //form.append('maxBodyLength','Infinity');

    let requestHeaders: RequestHeaders = form.getHeaders();
    if (JWT_BEARER_TOKEN) {
        requestHeaders['Authorization'] = `Bearer ${JWT_BEARER_TOKEN}`;
    }
    if (COOKIES) {
        requestHeaders['cookie'] = COOKIES;
    }

    const conf={
        headers: requestHeaders,
        maxContentLength: Infinity,
        maxBodyLength: Infinity
    }

    //requestHeaders['Content-Type'] = 'multipart/form-data;boundary='+form.getBoundary();

    //await axios.post(REST_API_ENDPOINT + `/templates/${templateName}/versions`, form, { headers: requestHeaders })
    await axios.post(REST_API_ENDPOINT + `/templates/${templateName}/versions`, form, conf)
        .then(function (response: AxiosResponse<any>) {
            console.log(response);
            httpResponse = response;
        }).catch(function (error: any) {
            console.log(error);
            if (error.response) {
                httpResponse = error.response;
            } else if (error.request) {
                httpResponse = error.request;
            } else {
                httpResponse = error;
            }
        });

    return httpResponse;
}

export async function getCSARsFromName(csarName:any): Promise<AxiosResponse<any> | null> {
    let httpResponse: AxiosResponse<any> | null = null;

    let requestHeaders: RequestHeaders = {};
    if (JWT_BEARER_TOKEN) {
        requestHeaders['Authorization'] = `Bearer ${JWT_BEARER_TOKEN}`;
    }
    if (COOKIES) {
        requestHeaders['cookie'] = COOKIES;
    }

    await axios.get(REST_API_ENDPOINT + `/templates/filter?template_keyword_filter=${csarName}&template_type_name_filter=csar`, { headers: requestHeaders })
        .then(function (response: AxiosResponse<any>) {
            console.log(response);
            httpResponse = response;
        })
        .catch(function (error: any) {
            console.log(error);
            if (error.response) {
                httpResponse = error.response;
            } else if (error.request) {
                httpResponse = error.request;
            } else {
                httpResponse = error;
            }
        });

    return httpResponse;
}
