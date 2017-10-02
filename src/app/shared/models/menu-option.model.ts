export class MenuOption {
  public name: string;
  public icon: string;
  public enabled: boolean;
  public visible: boolean;
  public onClick: () => void;

  constructor(name: string, onClick: () => void, icon?: string, enabled?: boolean, visible?: boolean) {
    this.name = name;
    this.onClick = onClick;
    this.icon = icon ? icon : '';
    this.enabled = enabled ? enabled : true;
    this.visible = visible ? visible : true;
  }

}
