import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChicosComponent } from './chicos.component';

describe('Chicos', () => {
  let component: ChicosComponent;
  let fixture: ComponentFixture<ChicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChicosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
