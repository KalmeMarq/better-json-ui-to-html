import { convertLangFile, convertType, decomposeName, getSuperV3, Languages, localizeText } from "."
import { IElement, IDecomposedName, IScreenJSON, IUIScreens, TUsualObj, IElementV3, ILangJSON } from "./types"

/** @deprecated */
export function renderElement(parent: HTMLElement, { type, props, controls }: IElement) {
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
export function getSuperV2(data: any, dpname: IDecomposedName) {
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
export function renderElementV2(data: any, parent: HTMLElement, { type, props, controls }: IElement) {
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

/** @deprecated */
function convertToElementV2(parent: { [key: string]: any }, control: { [key: string]: any }, globalvars: TUsualObj<string>) {
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

      if(typeof value === 'string') {
        if(value.startsWith('$')) {
          if(control[value]) {
            obj.props[prop] = control[value]
          } else if(globalvars[value]) {
            obj.props[prop] = globalvars[value]
          }
        }
      }
    }
  })

  return obj
}

/** @deprecated */
function renderElementV3(globalvars: TUsualObj<string>, uis: IUIScreens, data: IScreenJSON, parent: HTMLElement, control: { [key: string]: any }) {
  const { type, props, controls } = convertToElementV2(data, control, globalvars)

  if(!type) throw new Error('Type expected!')
  let element = document.createElement(convertType(type))
  if(type === 'panel' || type === 'screen') {
    element.classList.add('panel')
  }
  if(type === 'stack_panel') {
    element.classList.add('stack_panel')
  }

  if(typeof controls === 'string') {
    let text = controls
    if(Languages.get(controls)) {
      if(props && props.localize !== undefined) {
        if(props.localize) {
          text = Languages.get(controls)
        }
      } else {
        text = Languages.get(controls)
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
      renderElementV3(globalvars, uis, data, element, dhn)
    })
  }

  if(type === 'stack_panel') {
    element.style.display = 'flex'

    if(props.orientation) {
      if(props.orientation === 'horizontal') {
        element.style.flexDirection = 'row'
      } else {
        element.style.flexDirection = 'column'
      }
    } else {
      element.style.flexDirection = 'column'
    }
  }

  Object.entries(props).forEach(([prop, value]) => {
    if(prop === 'css') {
      Object.entries(value).forEach((cssprop: any) => {
        element.style[cssprop[0] as any] = cssprop[1]
      })
    } else if(prop === 'texture' && type === 'image') {
      fetch('resources/' + value)
        .then(res => res.blob())
        .then(data => {
          let b = 'url(' + URL.createObjectURL(data) + ')'
          if(props.color) {
            b = props.color + ' ' + b 
          }
          element.style.background = b

          let img = new Image()
          img.src = 'resources/' + value
          img.onload = () => {
            element.style.width = img.width + 'px'
            element.style.height = img.height + 'px'
          } 

          if(props.color) {
            // @ts-ignore
            element.style['background-blend-mode'] = 'multiply'
          }
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
      element.appendChild(document.createTextNode(localizeText(value, props.localize)))
    } else if(prop === 'alpha') {
      if(type === 'image' || type === 'label') {
        element.style.opacity = `${value}`
      } else if(props.propagate_alpha) {
        element.style.opacity = `${value}`
      }
    } else if(prop === 'offset') {
      element.style.position = 'relative'
      element.style.left = typeof value[0] === 'number' ? value[0] + 'px' : 'calc(' + value[0] + ')'
      element.style.top = typeof value[1] === 'number' ? value[1] + 'px' : `calc(${value[1]})`
    } else if(prop === 'clip_children') {
      if(props.clip_children) {
        element.style.overflow = 'hidden'
      }
    } else if(prop === 'size') {
      element.style.width = typeof value[0] === 'number' ? value[0] + 'px' : `calc(${value[0]})`
      element.style.height = typeof value[1] === 'number' ? value[1] + 'px' : `calc(${value[1]})`
    } else if(prop === 'max_size') {
      element.style.maxWidth = typeof value[0] === 'number' ? value[0] + 'px' : `calc(${value[0]})`
      element.style.maxHeight = typeof value[1] === 'number' ? value[1] + 'px' : `calc(${value[1]})`
    } else if(prop === 'min_size') {
      element.style.minWidth = typeof value[0] === 'number' ? value[0] + 'px' : `calc(${value[0]})`
      element.style.minHeight = typeof value[1] === 'number' ? value[1] + 'px' : `calc(${value[1]})`
    } else if(prop === 'focus_enabled' && (type === 'button' || type === 'input_panel')) {
      if(props.focus_enabled) element.tabIndex = 0
    }
  })

  parent.appendChild(element)
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