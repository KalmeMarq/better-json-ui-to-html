import { IElementV4 } from "../types";
import UIElement from "./UIElement";

let tempActions: any = {
  'button.test0': function () {
    console.log('button.test0 was clicked')
  },
  'button.test1': function () {
    alert('test1')
  }
}

export default class UIButton extends UIElement {
  public hovered: boolean
  public locked: boolean

  public constructor(parent: UIElement | null, parentEl: HTMLElement, control: IElementV4) {
    super(parent, parentEl, control)

    this.hovered = false
    this.locked = false
  }

  public override init(): void {
    this.el.classList.add('button')

    this.applyProps()
    this.parentEl.appendChild(this.el)

    this.el.addEventListener('pointerover', (e) => {
      this.hovered = true
    })

    this.el.addEventListener('pointerleave', (e) => {
      this.hovered = false
    })
  }

  public override applyProps(): void {
    if(this.props.insecure_on_click) {
      this.el.onclick = () => {
        eval(this.props.insecure_on_click ?? '')
      }
    }

    if(this.props.button_mappings) {
      let bmpgs = this.props.button_mappings
      if(bmpgs.toString().startsWith('$')) {
        let v0 = this.getVar(bmpgs.toString())
        if(v0 !== undefined) bmpgs = v0
      }

      bmpgs.forEach(mapping => {
        let fromID = mapping.from_button_id
        if(fromID.toString().startsWith('$')) {
          let v0 = this.getVar(fromID.toString())
          if(v0 !== undefined) fromID = v0
        }

        let typ = mapping.mapping_type
        if(typ.toString().startsWith('$')) {
          let v0 = this.getVar(typ.toString())
          if(v0 !== undefined) typ = v0
        }

        let toID = mapping.to_button_id
        if(toID.toString().startsWith('$')) {
          let v0 = this.getVar(toID.toString())
          if(v0 !== undefined) toID = v0
        }

        let el = typ === 'global' ? document : this.el

        if(fromID === 'button.menu_ok') {
          el.addEventListener('click', (e) => {
            let n = tempActions[toID]
            if(n) {
              n()
            }
          })
        }

        if(fromID === 'button.menu_left' && typ === 'global') {
          (el as Document).addEventListener('keydown', (e) => {
            if(e.code === 'ArrowLeft') {
              let n = tempActions[toID]
              if(n) n()
            }
          })
        }

        if(fromID === 'button.menu_right' && typ === 'global') {
          (el as Document).addEventListener('keydown', (e) => {
            if(e.code === 'ArrowRight') {
              let n = tempActions[toID]
              if(n) n()
            }
          })
        }

        if(fromID === 'button.menu_up' && typ === 'global') {
          (el as Document).addEventListener('keydown', (e) => {
            if(e.code === 'ArrowUp') {
              let n = tempActions[toID]
              if(n) n()
            }
          })
        }

        if(fromID === 'button.menu_down' && typ === 'global') {
          (el as Document).addEventListener('keydown', (e) => {
            if(e.code === 'ArrowDown') {
              let n = tempActions[toID]
              if(n) n()
            }
          })
        }

        if(fromID === 'button.menu_cancel' && typ === 'global') {
          (el as Document).addEventListener('keydown', (e) => {
            if(e.code === 'Escape') {
              let n = tempActions[toID]
              if(n) n()
            }
          })
        }
      })
    }

    if(this.props.focus_enabled) {
      let v = this.props.focus_enabled
      if(v.toString().startsWith('$')) {
        let v0 = this.getVar(v.toString())
        if(v0 !== undefined) v = v0
      }

      if(v === true) {
        this.el.tabIndex = 0
      }
    }

    if(this.props.enabled !== undefined) {
      let v = this.props.enabled
      if(v.toString().startsWith('$')) {
        let v0 = this.getVar(v.toString())
        if(v0 !== undefined) v = v0
      }

      if(v === false) {
        this.el.classList.add('locked')
        this.locked = true
      }
    }

    if(this.props.tts_name) {
      let v = this.props.tts_name
      if(v.toString().startsWith('$')) {
        let v0 = this.getVar(v.toString())
        if(v0 !== undefined) v = v0
      }

      this.el.setAttribute('aria-label', v)

    }
    
    super.applyProps()
  }
}