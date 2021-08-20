import { IColor } from "../types";
import UIElement from "./UIElement";

export default class UIImage extends UIElement {
  public override init(): void {

    this.applyProps()
    this.parentEl.appendChild(this.el)
  }

  public override applyProps(): void {
    if(this.props.texture) {
      let v = this.props.texture

      fetch('resources/' + v)
      .then(res => res.blob())
      .then(data => {
        let b = 'url(' + URL.createObjectURL(data) + ')'
        if(this.props.color) {
          b = this.convertColor(this.props.color) + ' ' + b 
        }
        this.el.style.background = b

        let img = new Image()
        img.src = 'resources/' + v
        img.onload = () => {
          this.el.style.width = img.width + 'px'
          this.el.style.height = img.height + 'px'
        } 

        if(this.props.color) {
          // @ts-ignore
          this.el.style['background-blend-mode'] = 'multiply'
        }
      })
    }

    super.applyProps()
  }
}