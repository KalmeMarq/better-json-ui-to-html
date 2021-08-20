import { localizeText } from ".."
import { IColor } from "../types"
import UIElement from "./UIElement"

export default class UILabel extends UIElement {
  public override init(): void {
    this.el.classList.add('label')

    this.applyProps()
    this.parentEl.appendChild(this.el) 
  }

  public override applyProps(): void {
    if(this.props.text) {
      let v = this.props.text
      if(v.toString().startsWith('$')) {
        let v0 = this.getVar(v.toString())
        if(v0 !== undefined) v = v0
      }

      this.el.appendChild(document.createTextNode(localizeText(v, this.props.localize)))
    }

    if(this.props.color) {
      let v = this.props.color
      if(v.toString().startsWith('$')) {
        let v0 = this.getVar(v.toString())
        if(v0 !== undefined) v = v0
      }

      this.el.style.color = this.convertColor(v)
    }

    if(this.props.alpha) {
      let v = this.props.alpha
      if(v.toString().startsWith('$')) {
        let v0 = this.getVar(v.toString())
        if(v0 !== undefined) v = v0
      }

      this.el.style.opacity = `${v}`
    }

    if(this.props.font_type) {
      let v = this.props.font_type
      if(v.toString().startsWith('$')) {
        let v0 = this.getVar(v.toString())
        if(v0 !== undefined) v = v0
      }

      this.el.style.fontFamily = v
    }

    if(this.props.font_size) {
      let v = this.props.font_size
      if(v.toString().startsWith('$')) {
        let v0 = this.getVar(v.toString())
        if(v0 !== undefined) v = v0
      }

      this.el.style.fontSize = `${v}`
    }

    if(this.props.shadow && this.props.shadow_config) {
      let v = this.props.shadow
      if(v.toString().startsWith('$')) {
        let v0 = this.getVar(v.toString())
        if(v0 !== undefined) v = v0
      }

      let v1 = this.props.shadow_config
      if(v1.toString().startsWith('$')) {
        let v2 = this.getVar(v1.toString())
        if(v2 !== undefined) v = v2
      }

      if(v) this.el.style.textShadow = `
        ${v1.h ?? '1px'}
        ${v1.v ?? '1px'}
        ${v1.blur ?? '0px'}
        ${v1.color ?? 'black'}`
    }

    super.applyProps()
  }
}