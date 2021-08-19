import { IDecomposedName, IElement, IElementV3, ILangJSON, IScreenJSON, IUIDefs, IUIScreens, IUsualObj, TUsualObj } from "./types"
import JSON5 from 'json5'

 /** @deprecated */
 function renderElement(parent: HTMLElement, { type, props, controls }: IElement) {
  let element = document.createElement(convertType(type))

  if(typeof controls === 'string') {
    element.appendChild(document.createTextNode(controls))
  } else if(Array.isArray(controls)) {
    controls.forEach(child => {
      renderElement(element, child)
    })
  }

  if(props) {
    if(props.css) {
      Object.entries(props.css).forEach((cssprop) => {
        element.style[cssprop[0] as any] = cssprop[1]
      })
    }
    if(props.font_type) {
      element.style.fontFamily = props.font_type
    }
    if(props.visible !== undefined) {
      if(!props.visible) {
        element.style.display = 'none'
      }
    }
    if(props.ignored !== undefined) {
      if(props.ignored) {
        element.style.display = 'none'
      }
    }
    if(props.font_size) {
      element.style.fontSize = props.font_size
    }
    if(props.color) {
      element.style.color = props.color
    }
    if(props.shadow_config && props.shadow) {
      element.style.textShadow = `
        ${props.shadow_config.h ?? '1px'}
        ${props.shadow_config.v ?? '1px'}
        ${props.shadow_config.blur ?? '0px'}
        ${props.shadow_config.color ?? 'black'}`
    }
  }

  parent.appendChild(element)
}

/** @deprecated */
function getSuperV2(data: any, dpname: IDecomposedName) {
  let l = Object.entries(data)
  if(dpname.namespace) {
    // l = Object.entries(uiFiles[dpname.namespace])
  }

  let b: any = l.find(n => {
    let p = decomposeName(n[0])
    return p.name === dpname.super
  })
  let s = decomposeName(b[0])

  if(!b) return {}
  let v = b[1]

  if(s.super) {
    v = { ...getSuperV2(data, s), ...v }
  }
  return v
}

/** @deprecated */
function renderElementV2(data: any, parent: HTMLElement, { type, props, controls }: IElement) {
  if(!type) throw new Error('Type expected!')
  let element = document.createElement(convertType(type))

  if(typeof controls === 'string') {
    let b = controls
   /*  if(langJSON[controls]) {
      if(props && props.localize !== undefined) {
        if(props.localize) {
          b = langJSON[controls]
        }
      } else {
        b = langJSON[controls]
      }
    } */
    element.appendChild(document.createTextNode(b))
  } else if(Array.isArray(controls)) {
    controls.forEach(child => {
      let dhm = decomposeName(Object.keys(child)[0])
      let dhn = Object.values(child)[0]
      if(dhm.super) {
        dhn = { ...getSuperV2(data, dhm), ...dhn }
      }
      renderElementV2(data, element, dhn)
    })
  }

  if(props) {
    if(props.css) {
      Object.entries(props.css).forEach((cssprop) => {
        element.style[cssprop[0] as any] = cssprop[1]
      })
    }
    if(props.font_type) {
      element.style.fontFamily = props.font_type
    }
    if(props.visible !== undefined) {
      if(!props.visible) {
        element.style.display = 'none'
      }
    }
    if(props.ignored !== undefined) {
      if(props.ignored) {
        element.style.display = 'none'
      }
    }
    if(props.font_size) {
      element.style.fontSize = props.font_size
    }
    if(props.color) {
      element.style.color = props.color
    }
    if(props.shadow_config && props.shadow) {
      element.style.textShadow = `
        ${props.shadow_config.h ?? '1px'}
        ${props.shadow_config.v ?? '1px'}
        ${props.shadow_config.blur ?? '0px'}
        ${props.shadow_config.color ?? 'black'}`
    }
  }

  parent.appendChild(element)
}

function convertType(type: string): string {
  switch(type) {
    case 'image':
      return 'img'
    case 'label':
      return 'p'
    case 'screen':
    case 'panel':
    case 'stack_panel':
    case 'input_panel':
      return 'div'
    default:
      return type
  }
}

async function fetchJSON(url: string) {
  return JSON5.parse(await (await fetch(url)).text())
}

function convertLangFile(langfile: string): ILangJSON {
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

function decomposeName(name: string): IDecomposedName {
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

function getSuperV3(uis: IUIScreens, data: IScreenJSON, dpname: IDecomposedName) {
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

async function getLangs(langsfile: string[]) {
  let obj: TUsualObj<ILangJSON> = {}

  for(let i = 0; i < langsfile.length; i++) {
    await new Promise<void>(async(resolve, reject) => {
      const langFile = await (await fetch('resources/texts/' + langsfile[i] +'.lang')).text()
      obj[langsfile[i]] = convertLangFile(langFile)
      resolve()
    })
  }

  return obj
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

function convertToElementV2(control: { [key: string]: any }) {
  let obj: IElementV3 = {
    type: '',
    props: {},
    controls: ''
  }

  Object.entries(control).forEach(([prop, value]) => {
    if(prop === 'type') obj.type = value
    else if(prop === 'controls') obj.controls = value
    else {
      obj.props[prop] = value
    }
  })

  return obj
}

function localizeText(langs: TUsualObj<ILangJSON>, text: string, localize?: boolean) {
  let txt = text
  if(langs['en_US'][text]) {
    if(localize !== undefined) {
      if(localize) {
        txt = langs['en_US'][text]
      }
    } else {
      txt = langs['en_US'][text]
    }
  }

  return txt
}

function renderElementV3(uis: IUIScreens, data: IScreenJSON, langs: TUsualObj<ILangJSON>, parent: HTMLElement, control: { [key: string]: any }) {
  const { type, props, controls } = convertToElementV2(control)

  if(!type) throw new Error('Type expected!')
  let element = document.createElement(convertType(type))

  if(typeof controls === 'string') {
    let text = controls
    if(langs['en_US'][controls]) {
      if(props && props.localize !== undefined) {
        if(props.localize) {
          text = langs['en_US'][controls]
        }
      } else {
        text = langs['en_US'][controls]
      }
    }
    element.appendChild(document.createTextNode(text))
  } else if(Array.isArray(controls)) {
    controls.forEach(child => {
      let dhm = decomposeName(Object.keys(child)[0])
      let dhn = Object.values(child)[0]
      if(dhm.super) {
        dhn = { ...getSuperV3(uis, data, dhm), ...dhn }
      }
      renderElementV3(uis, data, langs, element, dhn)
    })
  }

  Object.entries(props).forEach(([prop, value]) => {
    if(prop === 'css') {
      Object.entries(value).forEach((cssprop: any) => {
        element.style[cssprop[0] as any] = cssprop[1]
      })
    } else if(prop === 'font_type') {
      element.style.fontFamily = value
    } else if(prop === 'visible') {
      if(!value) element.style.display = 'none'
    } else if(prop === 'ignored') {
      if(value) element.style.display = 'none'
    } else if(prop === 'font_size') {
      element.style.fontSize = value
    } else if(prop === 'color') {
      element.style.color = value
    } else if(prop === 'shadow_config' && props.shadow) {
      element.style.textShadow = `
        ${value.h ?? '1px'}
        ${value.v ?? '1px'}
        ${value.blur ?? '0px'}
        ${value.color ?? 'black'}`
    } else if(prop === 'text') {
      element.appendChild(document.createTextNode(localizeText(langs, value, props.localize)))
    }
  })

  parent.appendChild(element)
}

;(async() => {
  let rootDiv = document.getElementById('root') as HTMLDivElement
  
  if(!rootDiv) {
    rootDiv = document.createElement('div') as HTMLDivElement
    rootDiv.id = 'root'
    document.prepend(rootDiv)
  }

  const langsFile = await fetchJSON('resources/texts/languages.json')
  const langs: TUsualObj<ILangJSON> = await getLangs(langsFile)
  
  const uiDefsFile = await fetchJSON('resources/ui/_ui_defs.json')
  const uis: IUIScreens = await getUIs(uiDefsFile)

  renderElementV3(uis, uis['start_screen'], langs, rootDiv, uis['start_screen'].screen)
})()

  // const uiDefs: IUIDefs = JSON5.parse(await (await fetch('resources/_ui_defs.json')).text())
  // for(let idx = 0; idx < uiDefs.ui_defs.length; idx++) {
  //   await new Promise<void>(async(resolve, reject) => {
  //     uiFiles[uiDefs.ui_defs[idx].replace('.json', '')] = JSON5.parse(await (await fetch('resources/' + uiDefs.ui_defs[idx])).text())
  //     resolve()
  //   })
  // }

  // const typesV2JSON = JSON5.parse(await (await fetch('resources/start_screen_v2.json')).text())

  
  // const langFile = await (await fetch('resources/texts/en_US.lang')).text()
  // langJSON = convertLangFile(langFile)
  // console.log(langJSON);

  // renderElement(rootDiv, typesJSON)
  // renderElementV2(typesV2JSON, rootDiv, typesV2JSON.screen)
/* 
  

*/