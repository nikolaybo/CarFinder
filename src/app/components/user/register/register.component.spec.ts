import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { NotificationService } from '../../../services/notification/notification.service';
import { of } from 'rxjs';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../../services/auth/auth.service';
import { TranslationService } from '../../../services/translation/translation.service';
import { createMockTranslationService, mockUser } from '../../../../testing/test-helpers';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authSpy: jasmine.SpyObj<AuthService>;
  let notificationSpy: jasmine.SpyObj<NotificationService>;
  let router: Router;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('AuthService', ['register']);
    authSpy.register.and.returnValue(of({ data: { user: mockUser, session: null }, error: null }));
    notificationSpy = jasmine.createSpyObj('NotificationService', ['showError', 'showSuccess']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        { provide: AuthService, useValue: authSpy },
        { provide: NotificationService, useValue: notificationSpy },
        { provide: TranslationService, useValue: createMockTranslationService() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form validation', () => {
    it('form is invalid when empty', () => {
      expect(component.registerForm.invalid).toBeTrue();
    });

    it('username field is invalid when shorter than 3 characters', () => {
      component.registerForm.get('username')?.setValue('ab');
      expect(component.registerForm.get('username')?.hasError('minlength')).toBeTrue();
    });

    it('username field is valid with 3 or more characters', () => {
      component.registerForm.get('username')?.setValue('alice');
      expect(component.registerForm.get('username')?.valid).toBeTrue();
    });

    it('email field is invalid with bad format', () => {
      component.registerForm.get('email')?.setValue('not-an-email');
      expect(component.registerForm.get('email')?.hasError('email')).toBeTrue();
    });

    it('password field is invalid when shorter than 8 characters', () => {
      component.registerForm.get('password')?.setValue('short');
      expect(component.registerForm.get('password')?.hasError('minlength')).toBeTrue();
    });

    it('form is valid when all fields have correct values', () => {
      component.registerForm.setValue({
        username: 'alice',
        email: 'alice@example.com',
        password: 'validpass',
      });
      expect(component.registerForm.valid).toBeTrue();
    });
  });

  describe('onSubmit()', () => {
    it('does not call authService when form is invalid', () => {
      component.onSubmit();
      expect(authSpy.register).not.toHaveBeenCalled();
    });

    it('calls authService.register() with username, email, and password', fakeAsync(() => {
      component.registerForm.setValue({
        username: 'alice',
        email: 'alice@example.com',
        password: 'validpass',
      });
      component.onSubmit();
      tick();
      expect(authSpy.register).toHaveBeenCalledWith('alice@example.com', 'alice', 'validpass');
    }));

    it('navigates to / on successful registration', fakeAsync(() => {
      spyOn(router, 'navigateByUrl');
      component.registerForm.setValue({
        username: 'alice',
        email: 'alice@example.com',
        password: 'validpass',
      });
      component.onSubmit();
      tick();
      expect(router.navigateByUrl).toHaveBeenCalledWith('/');
    }));

    it('opens snackBar with error message on registration failure', fakeAsync(() => {
      authSpy.register.and.returnValue(
        of({ data: { user: null, session: null }, error: { message: 'Email already exists' } as any })
      );
      component.registerForm.setValue({
        username: 'alice',
        email: 'alice@example.com',
        password: 'validpass',
      });
      component.onSubmit();
      tick();
      expect(notificationSpy.showError).toHaveBeenCalledWith('Email already exists');
    }));
  });
});
