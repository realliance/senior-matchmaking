declare global {
    namespace NodeJS {
        interface Global {
            rootdir: string;
        }
    }
}

export default global;
