import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-token-expired-modal',
  template: `
    <ng-template #tokenExpiredModal let-modal>
      <div class="modal-header">
        <h4 class="modal-title">Sesión Expirada</h4>
        <button type="button" class="btn-close" aria-label="Close" (click)="modal.dismiss('Cross click')"></button>
      </div>
      <div class="modal-body">
        <p>Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" (click)="onModalClose(modal)">Aceptar</button>
      </div>
    </ng-template>
  `
})
export class TokenExpiredModalComponent implements OnInit {
  @ViewChild('tokenExpiredModal') tokenExpiredModal!: TemplateRef<any>;

  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userService.tokenExpired$.subscribe(() => {
      this.open();
    });
  }

  open() {
    this.modalService.open(this.tokenExpiredModal, { ariaLabelledBy: 'modal-basic-title' });
  }

  onModalClose(modal: any) {
    modal.close();
    this.router.navigate(['/auth']);
  }
}
