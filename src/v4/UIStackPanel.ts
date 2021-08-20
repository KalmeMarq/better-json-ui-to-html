import UIPanel from "./UIPanel";

export default class UIStackPanel extends UIPanel {
  public override init(): void {
    this.el.classList.add('stack_panel')

    this.applyProps()
    this.parentEl.appendChild(this.el) 
  }

  public override applyProps(): void {
    if(this.props.orientation) {
      let v = this.props.orientation
      if(v.toString().startsWith('$')) {
        let v0 = this.getVar(v.toString())
        if(v0 !== undefined) v = v0
      }

      switch(v) {
        case 'vertical':
          break;
        case 'horizontal':
          this.el.style.flexDirection = 'row'
          break;
        default:
          break;
      }
    }

    super.applyProps()
  }
}