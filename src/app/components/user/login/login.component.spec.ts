import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { NotificationService } from '../../../services/notification/notification.service';
import { of } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../services/auth/auth.service';
import { TranslationService } from '../../../services/translation/translation.service';
import { createMockTranslationService, mockUser } from '../../../../testing/test-helpers';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authSpy: jasmine.SpyObj<AuthService>;
  let notificationSpy: jasmine.SpyObj<NotificationService>;
  let router: Router;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('AuthService', ['logIn']);
    authSpy.logIn.and.returnValue(of({ data: { user: mockUser, session: null }, error: null }));
    notificationSpy = jasmine.createSpyObj('NotificationService', ['showError', 'showSuccess']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        { provide: AuthService, useValue: authSpy },
        { provide: NotificationService, useValue: notificationSpy },
        { provide: TranslationService, useValue: createMockTranslationService() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form validation', () => {
    it('form is invalid when empty', () => {
      expect(component.loginForm.invalid).toBeTrue();
    });

    it('email field is invalid without a value', () => {
      expect(component.loginForm.get('email')?.invalid).toBeTrue();
    });

    it('email field is invalid with a bad format', () => {
      component.loginForm.get('email')?.setValue('not-an-email');
      expect(component.loginForm.get('email')?.hasError('email')).toBeTrue();
    });

    it('email field is valid with correct format', () => {
      component.loginForm.get('email')?.setValue('test@example.com');
      expect(component.loginForm.get('email')?.valid).toBeTrue();
    });

    it('password field is invalid when shorter than 8 characters', () => {
      component.loginForm.get('password')?.setValue('short');
      expect(component.loginForm.get('password')?.hasError('minlength')).toBeTrue();
    });

    it('form is valid with correct email and password', () => {
      component.loginForm.setValue({ email: 'test@example.com', password: 'validpass' });
      expect(component.loginForm.valid).toBeTrue();
    });
  });

  describe('onSubmit()', () => {
    it('does not call authService when form is invalid', () => {
      component.onSubmit();
      expect(authSpy.logIn).not.toHaveBeenCalled();
    });

    it('calls authService.logIn() with email and password on valid submit', fakeAsync(() => {
      component.loginForm.setValue({ email: 'test@example.com', password: 'validpass' });
      component.onSubmit();
      tick();
      expect(authSpy.logIn).toHaveBeenCalledWith('test@example.com', 'validpass');
    }));

    it('navigates to / on successful login', fakeAsync(() => {
      spyOn(router, 'navigateByUrl');
      component.loginForm.setValue({ email: 'test@example.com', password: 'validpass' });
      component.onSubmit();
      tick();
      expect(router.navigateByUrl).toHaveBeenCalledWith('/');
    }));

    it('opens snackBar with error message on login failure', fakeAsync(() => {
      authSpy.logIn.and.returnValue(of({ data: { user: null, session: null }, error: { message: 'Invalid credentials' } as any }));
      component.loginForm.setValue({ email: 'test@example.com', password: 'wrongpass' });
      component.onSubmit();
      tick();
      expect(notificationSpy.showError).toHaveBeenCalledWith('Invalid credentials');
    }));
  });
});
