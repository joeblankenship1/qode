import { ComponentFactoryResolver,
  Injectable,
  Inject,
  ReflectiveInjector } from '@angular/core';
import { SimpleQueryEditorComponent } from '../../work-space/popup-window/simple-query-editor/simple-query-editor.component';
import { ViewContainerRef } from '@angular/core';
import { ComplexQueryEditorComponent } from '../../work-space/popup-window/complex-query-editor/complex-query-editor.component';

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
    this.rootViewContainer.clear();
    this.component = this.rootViewContainer.createComponent(factory);
  }

  loadComplexQueryEditor() {
    const factory = this.factoryResolver
                        .resolveComponentFactory(ComplexQueryEditorComponent);
    this.rootViewContainer.clear();
    this.component = this.rootViewContainer.createComponent(factory);
  }

  destroyComponent() {
    if (this.rootViewContainer) {
      this.rootViewContainer.clear();
    }
  }

}
