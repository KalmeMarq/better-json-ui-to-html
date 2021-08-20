import UIElement from "./UIElement";

export default class UICustomGradient extends UIElement {
  public override init(): void {

    this.applyProps()
    this.parentEl.appendChild(this.el)
  }
  
  public override applyProps(): void {

    if(this.props.color1 && this.props.color2) {
      this.el.style.background = `linear-gradient(180deg, ${this.convertColor(this.props.color1)} 0%, ${this.convertColor(this.props.color2)} 100%)`
    }

    if(this.props.advanced_config) {
      let v = this.props.advanced_config

      let type = v.type
      let angle = v.angle ?? '0deg'
      let colors = v.colors.map(c => `${this.convertColor(c.color)} ${c.stop}`).join(',')

      let result = `${type}-gradient(${type === 'linear' ? angle : 'circle'}, ${colors})`

      this.el.style.background = result
    }

    super.applyProps()
  }
}