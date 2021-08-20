import { globalVars } from ".."
import { IElementProps4, IElement, IElementV4, ISize, IColor } from "../types"
import UILabel from "./UILabel"

export default class UIElement {
  public el: HTMLElement
  public parent: UIElement | null
  public parentEl: HTMLElement
  public type: string
  public props: IElementProps4
  public controls: IElement[]
  public children: UIElement[]

  public constructor(parent: UIElement | null, parentEl: HTMLElement, control: IElementV4) {
    this.el = document.createElement('div')
    this.parentEl = parentEl
    this.parent = parent
    this.type = control.type
    this.props = control.props
    this.controls = control.controls
    this.children = []

    this.init()
  }

  public init(): void {
  }

  public appendChildren(): void {

  }

  public getVar(varname: string) {
    let v = this.props[varname]

    if(v === undefined) {
      if(this.parent) {
        v = this.parent.getVar(varname)
      } else {
        v = globalVars[varname]
      }
    }

    return v
  }

  public applyProps(): void {
    if(this.props.css) {
      let v = this.props.css
      if(v.toString().startsWith('$')) {
        let v0 = this.getVar(v.toString())
        if(v0 !== undefined) v = v0
      }
      
      Object.entries(v).forEach((cssprop: any) => {
        this.el.style[cssprop[0] as any] = cssprop[1]
      })
    }

    if(this.props.size) {
      let v = this.props.size
      if(v.toString().startsWith('$')) {
        let v0 = this.getVar(v.toString())
        if(v0 !== undefined) v = v0
      }

      let sz = this.convertSize(v)
      this.el.style.width = sz[0]
      this.el.style.height = sz[1]
      this.el.style.maxWidth = sz[0]
      this.el.style.maxHeight = sz[1]
      this.el.style.minWidth = sz[0]
      this.el.style.minHeight = sz[1]
    }

    if(this.props.max_size) {
      let v = this.props.max_size
      if(v.toString().startsWith('$')) {
        let v0 = this.getVar(v.toString())
        if(v0 !== undefined) v = v0
      }

      let sz = this.convertSize(v)
      this.el.style.maxWidth = sz[0]
      this.el.style.maxHeight = sz[1]
    }

    if(this.props.min_size) {
      let v = this.props.min_size
      if(v.toString().startsWith('$')) {
        let v0 = this.getVar(v.toString())
        if(v0 !== undefined) v = v0
      }

      let sz = this.convertSize(v)
      this.el.style.minWidth = sz[0]
      this.el.style.minHeight = sz[1]
    }

    if(this.props.clip_children) {
      let v = this.props.clip_children
      if(v.toString().startsWith('$')) {
        let v0 = this.getVar(v.toString())
        if(v0 !== undefined) v = v0
      }

      if(v) this.el.style.overflow = 'hidden'
    }

    if(this.props.visible !== undefined) {
      let v = this.props.visible
      if(v.toString().startsWith('$')) {
        let v0 = this.getVar(v.toString())
        if(v0 !== undefined) v = v0
      }
      
      if(v === false) this.el.style.display = 'none'
    }

    if(this.props.ignored !== undefined) {
      let v = this.props.ignored
      if(v.toString().startsWith('$')) {
        let v0 = this.getVar(v.toString())
        if(v0 !== undefined) v = v0
      }

      if(v === true) this.el.style.display = 'none'
    }

    if(this.props.layer) {
      let v = this.props.layer
      if(v.toString().startsWith('$')) {
        let v0 = this.getVar(v.toString())
        if(v0 !== undefined) v = v0
      }
      
      this.el.style.zIndex = `${v}`
    }

    if(this.props.offset) {
      let v = this.props.offset
      if(v.toString().startsWith('$')) {
        let v0 = this.getVar(v.toString())
        if(v0 !== undefined) v = v0
      }

      let off = this.convertSize(v)
      this.el.style.left = off[0]
      this.el.style.top = off[1]
    }

    if(this.props.anchor_from && this.props.anchor_to) {
      // this.el.style.position = 'fixed'
      // top_left | top = 0 && left = 0 && translate(0, 0)
      // top_right | top = 0 && right = 0 && translate(0, 0)
      // top_middle | top = 0 && left = 50% && translate(-50%, 0)

      // bottom_left | bottom = 0 && left = 0 && translate(0, 0)
      // bottom_right | bottom = 0 && right = 0 && translate(0, 0)
      // bottom_middle | bottom = 0 && left = 50% && translate(-50%, 0)

      // left_middle | top = 50% && left = 0 && translate(0, -50%)
      // right_middle | top = 50% && right = 0 && translate(0, -50%)

      // center | top = 50% && left = 50% && translate(-50%, -50%)

      let oy = this.el.style.top
      let ox = this.el.style.left

      switch(this.props.anchor_from) {
        case 'right_middle':
          this.el.style.top = `calc(50% + (${oy}))`
          this.el.style.left = `calc(100% + ${ox})`
          this.el.style.transform = `translate(-100%, -50%)`
          break;
        case 'center':
          this.el.style.top = `calc(50% + (${oy}))`
          this.el.style.left = `calc(50% + ${ox})`
          this.el.style.transform = `translate(-50%, -50%)`
          break;
        case 'left_middle':
          this.el.style.top = `calc(50% + (${oy}))`
          this.el.style.left = `calc(${ox})`
          this.el.style.transform = `translate(0, -50%)`
          break;
        case 'bottom_middle':
          this.el.style.top = `calc(100% + (${oy}))`
          this.el.style.left = `calc(50% + (${ox}))`
          this.el.style.transform = `translate(-50%, -100%)`
          break;
        case 'bottom_right':
          this.el.style.top = `calc(100% + (${oy}))`
          this.el.style.left = `calc(100% + (${ox}))`
          this.el.style.transform = `translate(-100%, -100%)`
          break;
        case 'bottom_left':
          this.el.style.top = `calc(100% + (${oy}))`
          this.el.style.left = `calc(${ox})`
          this.el.style.transform = `translate(0, -100%)`
          break;
        case 'top_middle':
          this.el.style.top = `calc(${oy})`
          this.el.style.left = `calc(50% + (${ox}))`
          this.el.style.transform = `translate(-50%, 0)`
          break;
        case 'top_right':
          this.el.style.top = `calc(${oy})`
          this.el.style.left = `calc(100% + (${ox}))`
          this.el.style.transform = `translate(-100%, 0)`
          break;
        case 'top_left':
          this.el.style.top = `calc(${oy})`
          this.el.style.left = `calc(${ox})`
          break;
        default:
          break;
      }
    } else {
      this.el.style.top = `calc(50%)`
      this.el.style.left = `calc(50%)`
      this.el.style.transform = `translate(-50%, -50%)`
    }
  }

  protected convertSize(size: ISize): [string, string] {
    let result: [string, string] = ['', '']

    if(typeof size[0] === 'string') result[0] = `calc(${size[0]})`
    else result[0] = `${size[0]}px`

    if(typeof size[1] === 'string') result[1] = `calc(${size[1]})`
    else result[1] = `${size[1]}px`

    return result
  }

  protected convertColor(color: IColor): string {
    let result = color

    if(Array.isArray(result)) {
      if(result.length === 3) {
        result = `rgb(${result[0] * 255}, ${result[1] * 255}, ${result[2] * 255})`
      } else if(result.length === 4) {
        result = `rgba(${result[0] * 255}, ${result[1] * 255}, ${result[2] * 255}, ${result[3]})`
      } 
    }

    return result
  }
}