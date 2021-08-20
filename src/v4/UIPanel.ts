import UIElement from "./UIElement"

export default class UIPanel extends UIElement {
  public override init(): void {
    this.el.classList.add('panel')

    this.applyProps()
    this.parentEl.appendChild(this.el) 
  }

  public override applyProps(): void {
    if(this.props.alpha && this.props.propagate_alpha) {
      let v = this.props.alpha
      if(v.toString().startsWith('$')) {
        let v0 = this.getVar(v.toString())
        if(v0 !== undefined) v = v0
      }
      this.el.style.opacity = `${v}`
    }

    super.applyProps()
  }
}