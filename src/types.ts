export interface IElementProps {
  font_type?: string,
  font_size?: string,
  color?: string,
  shadow?: boolean,
  ignored?: boolean,
  visible?: boolean,
  localize?: boolean,
  shadow_config?: {
    h?: string,
    v?: string,
    blur?: string,
    color?: string,
  },
  css?: CSSStyleDeclaration
  [key: string]: any
}

export interface IElement {
  type: string,
  props?: IElementProps,
  controls: string | IElement[]
}

export interface IElementV3 {
  type: string,
  props: IElementProps,
  controls: string | IElement[]
}

export type IUsualObj = { [key: string]: IUsualObj }
export type TUsualObj<T> = { [key: string]: T }

export interface IUIDefs {
  ui_defs: string[]
}

export interface IDecomposedName {
  name: string;
  namespace: string | null;
  super: string | null;
}

export interface ILangJSON {
  [key: string]: string
}

export interface IScreenJSON {
  namespace: string,
  [key: string]: any
}

export type IUIScreens = { [key: string]: IScreenJSON }