import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let debugHeaderTitle: DebugElement;
  let elementHeaderTitle: HTMLElement;
  let debugLogo: DebugElement;
  let elementLogo: HTMLElement;

  // async beforeEach is called first
  beforeEach(async(() => {

    // call configureTestingModule within that TestBed can reset itself to a base state before each test runs
    TestBed.configureTestingModule({

      // declares the test component
      declarations: [ HeaderComponent ]
    })
    .compileComponents(); // compiles external template (templateUrl) and styles (styleUrls)
  }));

  // synchronous beforeEach
  beforeEach(() => {

    // a fixture creates a handle on the test environment surrounding the created component
    fixture = TestBed.createComponent(HeaderComponent);

    // create an instance of the component-under-test
    component = fixture.componentInstance;

    // use DebugElement to query the DOM then fetch the associated DOM element
    debugHeaderTitle = fixture.debugElement.query(By.css('.headerTitle'));
    elementHeaderTitle = debugHeaderTitle.nativeElement;

    debugLogo = fixture.debugElement.query(By.css('.logoImage'));
    elementLogo = debugLogo.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should have a header title that is bound to the title field', () => {
    fixture.detectChanges();
    expect(elementHeaderTitle.textContent).toContain(component.title);
  });

  it('should have an updated header title when the title field is mutated', () => {
    component.title = 'CSSL';
    fixture.detectChanges();
    expect(elementHeaderTitle.textContent).toContain(component.title);
  });
});
