import { IColor, IDecomposedName, IElement, IElementProps, IElementProps4, IElementV3, IElementV4, ILangJSON, IScreenJSON, ISize, IUIDefs, IUIScreens, IUsualObj, TUsualObj } from "./types"
import JSON5 from 'json5'
import UIElement from "./v4/UIElement"
import UILabel from "./v4/UILabel"
import UIPanel from "./v4/UIPanel"
import UIStackPanel from "./v4/UIStackPanel"
import UIButton from "./v4/UIButton"
import UIImage from "./v4/UIImage"
import UICustomGradient from "./v4/UICustomGradient"

let rootDiv = document.getElementById('root') as HTMLDivElement
  
  if(!rootDiv) {
    rootDiv = document.createElement('div') as HTMLDivElement
    rootDiv.id = 'root'
    document.prepend(rootDiv)
  }

export class Languages {
  public static lang = 'en_US' 
  private static langNames: Map<string, string> = new Map()
  private static langs: Map<string, ILangJSON> = new Map()

  public static async reload() {
    const data = await fetchJSON('resources/texts/languages.json')
    const dataNames: [string, string][] = await fetchJSON('resources/texts/language_names.json')
  
    dataNames.forEach(nm => {
      this.langNames.set(nm[0], nm[1])
    })

    for(let i = 0; i < data.length; i++) {
      await new Promise<void>(async(resolve, reject) => {
        const langFile = await (await fetch('resources/texts/' + data[i] +'.lang')).text()
        this.langs.set(data[i], convertLangFile(langFile))
        resolve()
      })
    }
  }

  public static getLang(code: string) {
    return this.langs.get(code) as ILangJSON
  }

  public static get(key: string) {
    return (this.langs.get(this.lang) as ILangJSON)[key]
  }

  public static getList() {
    return this.langNames
  }
}

export function convertType(type: string): string {
  switch(type) {
    case 'image':
      return 'div'
    case 'label':
      return 'p'
    case 'button':
    case 'screen':
    case 'panel':
    case 'stack_panel':
    case 'input_panel':
      return 'div'
    default:
      return type
  }
}

export async function fetchJSON(url: string) {
  return JSON5.parse(await (await fetch(url)).text())
}

export function convertLangFile(langfile: string): ILangJSON {
  let obj: ILangJSON = {}
  let l0 = langfile.split('\r\n')
  for(let i = 0; i < l0.length; i++) {
    let m0 = l0[i].trim()
    if(m0.startsWith('#')) continue
    let j = m0.indexOf('=')
    obj[m0.substring(0, j)] = m0.substring(j + 1, m0.length)
  }

  return obj
}

export function decomposeName(name: string): IDecomposedName {
  let txt = name
  let i = txt.indexOf('@')
  let j = txt.indexOf('.', i)
  let nm: string | null = txt
  let nmspace: string | null = null
  let supernm: string | null = null
  if(i >= 0) {
    nm = txt.substring(0, i)
    supernm = txt.substring(i + 1, txt.length)

    if(j >= 0) {
      nmspace = txt.substring(i + 1, j)
      supernm = txt.substring(j + 1, txt.length)
    }
  }

  return {
    name: nm,
    namespace: nmspace,
    super: supernm
  }
}

function removeExtension(filename: string) {
  return filename.substring(0, filename.lastIndexOf('.'))
}

export function getSuperV3(uis: IUIScreens, data: IScreenJSON, dpname: IDecomposedName) {
  let l = Object.entries(data)
  if(dpname.namespace) {
    l = Object.entries(uis[dpname.namespace])
  }

  let b: any = l.find(n => {
    let p = decomposeName(n[0])
    return p.name === dpname.super
  })
  let s = decomposeName(b[0])

  if(!b) return {}
  let v = b[1]

  if(s.super) {
    v = { ...getSuperV3(uis, data, s), ...v }
  }
  return v
}

async function getUIs(uidefsfile: IUIDefs) {
  let obj: IUIScreens = {}
  
  for(let i = 0; i < uidefsfile.ui_defs.length; i++) {
    await new Promise<void>(async(resolve, reject) => {
      const uifile: IScreenJSON = JSON5.parse(await (await fetch('resources/ui/' + uidefsfile.ui_defs[i])).text())
      obj[uifile.namespace] = uifile
      resolve()
    })
  }

  return obj
}

function convertToElementV4(control: { [key: string]: any }) {
  let obj: IElementV4 = {
    type: '',
    props: {
      offset: [0, 0]
    },
    controls: []
  }

  Object.entries(control).forEach(([prop, value]) => {
    if(prop === 'type') obj.type = value
    else if(prop === 'controls') obj.controls = value
    else {
      obj.props[prop] = value

      if(typeof value === 'string') {
        if(value.startsWith('$')) {
          if(control[value]) {
            obj.props[prop] = control[value]
          }
        }
      }
    }
  })

  return obj
}

export function localizeText(text: string, localize?: boolean) {
  let txt = text
  if(Languages.get(text)) {
    if(localize !== undefined) {
      if(localize) {
        txt = Languages.get(text)
      }
    } else {
      txt = Languages.get(text)
    }
  }

  return txt
}

function renderElementV4(uis: IUIScreens, data: IScreenJSON, parent: UIElement | null, parentEl: HTMLElement, element: IElementV4) {
  let dt = {
    type: element.type,
    props: element.props,
    controls: element.controls
  }

  if(parent) parent.el = parentEl
  
  let q: UIElement | undefined
  if(element.type === 'label') {
    q = new UILabel(parent, parentEl, dt)
  } else if(element.type === 'panel') {
    q = new UIPanel(parent, parentEl, dt)
  } else if(element.type === 'stack_panel') {
    q = new UIStackPanel(parent, parentEl, dt)
  } else if(element.type === 'button') {
    q = new UIButton(parent, parentEl, dt)
  } else if(element.type === 'image') {
    q = new UIImage(parent, parentEl, dt)
  } else if(element.type === 'custom') {
    if(element.props.renderer === 'gradient_renderer') {
      q = new UICustomGradient(parent, parentEl, dt)
    }
  } else {
    q = new UIPanel(parent, parentEl, dt)
  }

  dt.controls.forEach(c => {
    let ob = Object.entries(c)[0]
    let dnm = decomposeName(Object.keys(c)[0])
    let p = ob[1]
    if(dnm.super) {
      p = {...getSuperV3(uis, data, dnm), ...p}
    }

    let elP1 = convertToElementV4(p)
    if(q) renderElementV4(uis, data, q, q.el, elP1)
  })
}
export let globalVars: TUsualObj<string> = {}
;(async() => {
  await Languages.reload()
  
  const uiDefsFile = await fetchJSON('resources/ui/_ui_defs.json')
  const uis: IUIScreens = await getUIs(uiDefsFile)

  globalVars = await fetchJSON('resources/ui/_global_variables.json')

  Object.entries(uis['start_screen']).forEach(c0 => {
    if(c0[0] === 'screen') {
      let elP = convertToElementV4((c0[1] as any))
      renderElementV4(uis, uis['start_screen'], null, rootDiv, elP)
    }
  })
})()