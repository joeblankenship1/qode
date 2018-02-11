import { ComponentFactoryResolver,
  Injectable,
  Inject,
  ReflectiveInjector } from '@angular/core';
import { SimpleQueryEditorComponent } from '../../work-space/popup-window/simple-query-editor/simple-query-editor.component';
import { ViewContainerRef } from '@angular/core';
import { ComplexQueryEditorComponent } from '../../work-space/popup-window/complex-query-editor/complex-query-editor.component';
import { ChartPopupComponent } from '../../work-space/popup-window/chart-popup/chart-popup.component';

@Injectable()
export class PopupLoaderService {

  factoryResolver: ComponentFactoryResolver;
  rootViewContainer: ViewContainerRef;
  component;

  constructor(@Inject(ComponentFactoryResolver) factoryResolver) {
    this.factoryResolver = factoryResolver;
  }

  setRootViewContainerRef(viewContainerRef) {
    this.rootViewContainer = viewContainerRef;
  }

  loadSimpleQueryEditor() {
    const factory = this.factoryResolver
                        .resolveComponentFactory(SimpleQueryEditorComponent);
    this.component = this.rootViewContainer.createComponent(factory);
  }

  loadComplexQueryEditor() {
    const factory = this.factoryResolver
                        .resolveComponentFactory(ComplexQueryEditorComponent);
    const component = factory
      .create(this.rootViewContainer.parentInjector);
    this.rootViewContainer.insert(component.hostView);
  }

  loadChartPopup() {
    const factory = this.factoryResolver
                        .resolveComponentFactory(ChartPopupComponent);
    const component = factory
      .create(this.rootViewContainer.parentInjector);
    this.rootViewContainer.insert(component.hostView);
  }

  destroyComponent() {
    if (this.rootViewContainer) {
      this.rootViewContainer.clear();
    }
  }

}
