import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({ selector: '[appHasFeature]' })
export class HasFeatureDirective {
  constructor(private tpl: TemplateRef<any>, private vcRef: ViewContainerRef, private auth: AuthService) {}

  @Input() set appHasFeature(feature: string) {
    const user = this.auth.getUser();
    if (user && (user.role === 'admin' || user.permissions.includes(feature))) {
      this.vcRef.createEmbeddedView(this.tpl);
    } else {
      this.vcRef.clear();
    }
  }
}
