export interface IElementProps {
  font_type?: string,
  font_size?: string,
  color?: string,
  shadow?: boolean,
  ignored?: boolean,
  visible?: boolean,
  orientation?: 'horizontal' | 'vertical'
  alpha?: number,
  propagate_alpha?: boolean
  localize?: boolean,
  focus_enabled?: boolean,
  text?: string,
  clip_children?: boolean
  size?: [number | string, number | string]
  max_size?: [number | string, number | string]
  min_size?: [number | string, number | string]
  offset?: [number | string, number | string]
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

/* 

  "advanced_config": {
      "type": "linear",
      "angle": "20deg",
      "colors": [
        {
          "color": "blue",
          "stop": "0%"
        },
        {
          "color": "red",
          "stop": "100%"
        }
      ]
    },
*/

export interface IAdvancedConfigColor {
  color: string,
  stop: string
}

export interface IAdvancedConfig {
  type: 'linear' | 'radial',
  angle?: string
  colors: IAdvancedConfigColor[]
}

export interface IElementProps4 {
  font_type?: string,
  font_size?: string,
  advanced_config?: IAdvancedConfig,
  color?: IColor
  shadow?: boolean,
  renderer?: string,
  texture?: string,
  color1?: IColor,
  color2?: IColor,
  ignored?: boolean,
  visible?: boolean,
  orientation?: 'horizontal' | 'vertical'
  alpha?: number,
  propagate_alpha?: boolean
  localize?: boolean,
  focus_enabled?: boolean,
  text?: string,
  anchor_from?: IAnchor
  anchor_to?: IAnchor
  enabled?: boolean,
  clip_children?: boolean
  size?: [number | string, number | string]
  max_size?: [number | string, number | string]
  min_size?: [number | string, number | string]
  offset?: [number | string, number | string]
  tts_name?: string,
  insecure_on_click?: string,
  shadow_config?: {
    h?: string,
    v?: string,
    blur?: string,
    color?: string,
  },
  layer?: number,
  css?: CSSStyleDeclaration
  button_mappings?: IButtonMapping[]
  [key: string]: any
}

export interface IButtonMapping {
  from_button_id: string
  to_button_id: string
  mapping_type: 'global' | 'pressed' | 'focused'
}

export interface IElementV4 {
  type: string,
  props: IElementProps4,
  controls: IElement[]
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

export type IColor = string | [number, number, number] | [number, number, number, number]
export type ISize = [number | string, number | string]

type IAnchor0 = 'top' | 'bottom'
type IAnchor1 = 'left' | 'right'
export type IAnchor = `${IAnchor0}_${IAnchor1}` | `${IAnchor1 | IAnchor0}_middle` | 'center'