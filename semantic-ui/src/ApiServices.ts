import axios from "axios";

const baseUri = "http://localhost:80"

type Config = {
    title_line:number,
    first_line:number,
    sep: "," | ";" | "tab" | "espace" | "|",
    prefix_predicate: string,
    prefix_data: string
}

const getConfig = () => {
    return axios.get<Config>(baseUri + "/configuration");
}

const processFile = (sep:string,titleLine:number,firstLine:number,prefixPredicate:string,prefixData:string,file:File,lastLine?:number,) => {
    const formData = new FormData();
    formData.set("sep",sep);
    formData.set("titleLine",titleLine.toString());
    formData.set("firstLine",firstLine.toString());
    if (lastLine) formData.set("lastLine",lastLine.toString());
    formData.set("prefixPredicate",prefixPredicate);
    formData.set("prefixData",prefixData);
    formData.set("file",file);

    return axios.post<string>(baseUri + "/processFile",formData,{
        headers:{
            "Content-Type": "multipart/form-data",
            "accept": "application/json"
        }
    });
}

const ApiServices = {
    getConfig,
    processFile
};

export default ApiServices;
