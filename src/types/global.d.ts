export type IpcSuccess<T = unknown> = { success: true; data?: T; [k: string]: any };
export type IpcFailure = { success: false; error: string };
export type IpcResult<T = unknown> = IpcSuccess<T> | IpcFailure;

declare global {
  interface Window {
    electron?: {
      window: {
        minimize: () => Promise<void>;
        maximize: () => Promise<void>;
        close: () => Promise<void>;
        toggleFullScreen: () => Promise<void>;
        isMaximized: () => Promise<boolean>;
      };
      getVersion: () => Promise<string>;
      fs: {
        readFile: (path: string) => Promise<IpcResult<string>>;
        writeFile: (path: string, data: string) => Promise<IpcResult<void>>;
        exists: (path: string) => Promise<IpcSuccess<{ exists: boolean }>>;
      };
      db: {
        createDocument: (doc: any) => Promise<IpcResult<any>>;
        updateDocument: (id: string, updates: any) => Promise<IpcResult<any>>;
        getDocument: (id: string) => Promise<IpcResult<any>>;
        getAllDocuments: () => Promise<IpcResult<any[]>>;
        searchDocuments: (query: string) => Promise<IpcResult<any[]>>;
      };
      system: {
        openExternal: (url: string) => Promise<IpcResult<void>>;
        showItemInFolder: (path: string) => Promise<IpcResult<void>>;
      };
      on: (channel: string, callback: (...args: any[]) => void) => void;
      removeAllListeners: (channel: string) => void;
    };
  }
}

export {};

