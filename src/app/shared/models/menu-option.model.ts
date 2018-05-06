export class MenuOption {
  public name: string;
  public icon: string;
  public enabled: boolean;
  public visible: boolean;
  public onClick: (param?) => void;

  constructor(name: string, onClick: (param?) => void, icon?: string, enabled?: boolean, visible?: boolean) {
    this.name = name;
    this.onClick = onClick;
    this.icon = icon ? icon : '';
    this.enabled = enabled ? enabled : true;
    this.visible = visible ? visible : true;
  }

  public enable() {
    this.enabled = true;
  }

  public disable() {
    this.enabled = false;
  }

  public setVisible(visible) {
    this.visible = visible;
  }
}
