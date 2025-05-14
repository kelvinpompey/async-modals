import { useRouter } from "expo-router";
import React, { useContext, useRef } from "react";

function generateRandomString() {
  return Math.random().toString(36).substring(2, 12);
}

type Resolvers<T = any> = {
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
};

type ModalContextType<T = any> = {
  showModal: (path: string) => Promise<T>;
  resolveModal: (modalId: string, value?: T) => void;
  rejectModal: (modalId: string, reason?: any) => void;
};

const ModalContext = React.createContext<ModalContextType | null>(null);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const resolvers = useRef(new Map<string, Resolvers>());
  const router = useRouter();

  const showModal = <T,>(path: string) => {
    const modalId = generateRandomString();

    router.push({ pathname: path as never, params: { modalId } });
    return new Promise<T>((resolve, reject) => {
      resolvers.current.set(modalId, { resolve, reject });
    });
  };

  const resolveModal = <T,>(modalId: string, value?: T) => {
    const resolver = resolvers.current.get(modalId);
    if (resolver) {
      resolver.resolve(value as T);
      resolvers.current.delete(modalId);
      router.back();
    }
  };

  const rejectModal = (modalId: string, reason?: any) => {
    const resolver = resolvers.current.get(modalId);
    if (resolver) {
      resolver.reject(reason ?? "Modal was rejected");
      resolvers.current.delete(modalId);

      if (router.canGoBack()) {
        router.back();
      }
    }
  };

  return (
    <ModalContext.Provider value={{ showModal, resolveModal, rejectModal }}>
      {children}
    </ModalContext.Provider>
  );
};
