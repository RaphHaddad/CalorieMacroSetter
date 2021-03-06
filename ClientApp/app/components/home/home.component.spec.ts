﻿/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { assert } from 'chai';
import { HomeComponent } from './home.component';
import { RoundPipe } from '../../pipes/round.pipe';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';

let fixture: ComponentFixture<HomeComponent>;

describe('Home component', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [FormsModule, ChartsModule], declarations: [RoundPipe ,HomeComponent] });
        fixture = TestBed.createComponent(HomeComponent);
        fixture.detectChanges();
    });

    it('should calculate macro grams as 40 30 30 after tdee set', async(() => {
        fixture.componentInstance.totalCalories = 2000;

        fixture.componentInstance.onTotalCaloriesChange();

        expect(fixture.componentInstance.carbs.grams).toEqual(200);
        expect(fixture.componentInstance.protein.grams).toEqual(150);
        expect(fixture.componentInstance.fat.grams).toEqual(600/9);
    }));

    it('should change tdee when carb changes', async(() => {
        fixture.componentInstance.totalCalories = 2000;
        fixture.componentInstance.onTotalCaloriesChange();

        var totalCarbs = 150;
        fixture.componentInstance.carbs.grams = totalCarbs;
        fixture.componentInstance.protein.grams = 0;
        fixture.componentInstance.fat.grams = 0;
        fixture.componentInstance.onMacroGramsChange();

        expect(fixture.componentInstance.totalCalories).toEqual(totalCarbs * 4);
    }));

    it('should change tdee when protein changes', async(() => {
        fixture.componentInstance.totalCalories = 2000;
        fixture.componentInstance.onTotalCaloriesChange();

        var totalProtein = 150;
        fixture.componentInstance.carbs.grams = 0;
        fixture.componentInstance.protein.grams = totalProtein;
        fixture.componentInstance.fat.grams = 0;
        fixture.componentInstance.onMacroGramsChange();

        expect(fixture.componentInstance.totalCalories).toEqual(totalProtein * 4);
    }));

    it('should change tdee when fat grams changes', async(() => {
        fixture.componentInstance.totalCalories = 2000;
        fixture.componentInstance.onTotalCaloriesChange();

        var totalFat = 150;
        fixture.componentInstance.carbs.grams = 0;
        fixture.componentInstance.protein.grams = 0;
        fixture.componentInstance.fat.grams = totalFat;
        fixture.componentInstance.onMacroGramsChange();

        expect(fixture.componentInstance.totalCalories).toEqual(totalFat * 9);
    }));

    it('should change % when carb grams changes', async(() => {
        fixture.componentInstance.totalCalories = 2000;
        fixture.componentInstance.onTotalCaloriesChange();

        fixture.componentInstance.carbs.grams = 100;
        fixture.componentInstance.protein.grams = 400;
        fixture.componentInstance.fat.grams = 0;
        fixture.componentInstance.onMacroGramsChange();

        expect(fixture.componentInstance.carbs.percent).toEqual(20);
    }));

    it('should change % when protien grams changes', async(() => {
        fixture.componentInstance.totalCalories = 2000;
        fixture.componentInstance.onTotalCaloriesChange();

        fixture.componentInstance.carbs.grams = 100;
        fixture.componentInstance.protein.grams = 400;
        fixture.componentInstance.fat.grams = 0;
        fixture.componentInstance.onMacroGramsChange();

        expect(fixture.componentInstance.protein.percent).toEqual(80);
    }));

    it('should change % when fat grams changes', async(() => {
        fixture.componentInstance.totalCalories = 2000;
        fixture.componentInstance.onTotalCaloriesChange();

        fixture.componentInstance.carbs.grams = 100;
        fixture.componentInstance.protein.grams = 0;
        fixture.componentInstance.fat.grams = 50;
        fixture.componentInstance.onMacroGramsChange();

        var totalCalories = (100 * 4) + (50 * 9);
        var caloriesFromFat = (50 * 9);
        expect(fixture.componentInstance.fat.percent).toEqual(caloriesFromFat / totalCalories * 100);
    }));

    it('should adjust total calories correctly', async(() => {
        fixture.componentInstance.totalCalories = 2000;
        fixture.componentInstance.onTotalCaloriesChange();

        fixture.componentInstance.carbs.grams = 100;
        fixture.componentInstance.protein.grams = 30;
        fixture.componentInstance.fat.grams = 50;
        fixture.componentInstance.onMacroGramsChange();

        var totalCalories = (100 * 4) + (30 * 4) + (50 * 9);
        expect(fixture.componentInstance.totalCalories).toEqual(totalCalories);
    }));

    it('should redraw graph after total calories change', async(() => {
        fixture.componentInstance.totalCalories = 2000;

        fixture.componentInstance.onTotalCaloriesChange();

        expect(fixture.componentInstance.chartData[0]).toEqual(fixture.componentInstance.protein.percent);
        expect(fixture.componentInstance.chartData[1]).toEqual(fixture.componentInstance.fat.percent);
        expect(fixture.componentInstance.chartData[2]).toEqual(fixture.componentInstance.carbs.percent);
    }));

    it('should redraw graph after total calories change', async(() => {
        fixture.componentInstance.fat.grams = 10;
        fixture.componentInstance.carbs.grams = 20;
        fixture.componentInstance.protein.grams = 30;

        fixture.componentInstance.onMacroGramsChange();;

        expect(fixture.componentInstance.chartData[0]).toEqual(fixture.componentInstance.protein.percent);
        expect(fixture.componentInstance.chartData[1]).toEqual(fixture.componentInstance.fat.percent);
        expect(fixture.componentInstance.chartData[2]).toEqual(fixture.componentInstance.carbs.percent);
    }));

    it('should redraw graph after percent change for macro', async(() => {
        fixture.componentInstance.fat.grams = 10;
        fixture.componentInstance.carbs.grams = 20;
        fixture.componentInstance.protein.grams = 30;
        fixture.componentInstance.onMacroGramsChange();;

        fixture.componentInstance.fat.percent = 80;
        fixture.componentInstance.carbs.percent = 5;
        fixture.componentInstance.protein.percent = 15;
        fixture.componentInstance.onMacroPercentChange();

        expect(fixture.componentInstance.chartData[0]).toEqual(15);
        expect(fixture.componentInstance.chartData[1]).toEqual(80);
        expect(fixture.componentInstance.chartData[2]).toEqual(5);
    }));

    it('should label graph propertly', async(() => {
        fixture.componentInstance.totalCalories = 2000;

        fixture.componentInstance.onTotalCaloriesChange();

        expect(fixture.componentInstance.chartLabels[0]).toEqual('Protein');
        expect(fixture.componentInstance.chartLabels[1]).toEqual('Fat');
        expect(fixture.componentInstance.chartLabels[2]).toEqual('Carbs');
    }));

    it('should change carb grams when carb % changes', async(() => {
        fixture.componentInstance.totalCalories = 2000;

        fixture.componentInstance.carbs.percent = 50;
        fixture.componentInstance.protein.percent = 50;
        fixture.componentInstance.fat.percent = 0;
        fixture.componentInstance.onMacroPercentChange();

        expect(fixture.componentInstance.carbs.grams).toEqual(250);
    }));

    it('should change protein grams when protein % changes', async(() => {
        fixture.componentInstance.totalCalories = 2000;

        fixture.componentInstance.carbs.percent = 50;
        fixture.componentInstance.protein.percent = 30;
        fixture.componentInstance.fat.percent = 20;
        fixture.componentInstance.onMacroPercentChange();

        expect(fixture.componentInstance.protein.grams).toEqual(150);
    }));

    it('should change fat grams when fat % changes', async(() => {
        fixture.componentInstance.totalCalories = 2000;

        fixture.componentInstance.carbs.percent = 50;
        fixture.componentInstance.protein.percent = 30;
        fixture.componentInstance.fat.percent = 20;
        fixture.componentInstance.onMacroPercentChange();

        expect(Math.round(fixture.componentInstance.fat.grams)).toEqual(44);
    }));

    it('should round fat %', async(() => {
        fixture.componentInstance.totalCalories = 2000;

        fixture.componentInstance.carbs.percent = 50;
        fixture.componentInstance.protein.percent = 30;
        fixture.componentInstance.fat.percent = 20.04;
        fixture.componentInstance.onMacroPercentChange();

        expect(fixture.componentInstance.fat.percent).toEqual(20);
    }));

    it('should error if percent greater than 100', async(() => {
        fixture.componentInstance.totalCalories = 2000;

        fixture.componentInstance.fat.percent = 50;
        fixture.componentInstance.protein.percent = 49;
        fixture.componentInstance.carbs.percent = 2;

        fixture.componentInstance.onMacroPercentChange();

        expect(fixture.componentInstance.errors.length).toBeGreaterThan(0);
    }));

    it('should error if percent less than 100', async(() => {
        fixture.componentInstance.totalCalories = 2000;

        fixture.componentInstance.fat.percent = 50;
        fixture.componentInstance.protein.percent = 47;
        fixture.componentInstance.carbs.percent = 2;

        fixture.componentInstance.onMacroPercentChange();

        expect(fixture.componentInstance.errors.length).toBeGreaterThan(0);
    }));

    it('should not error if percent is 100', async(() => {
        fixture.componentInstance.totalCalories = 2000;

        fixture.componentInstance.fat.percent = 50;
        fixture.componentInstance.protein.percent = 47;
        fixture.componentInstance.carbs.percent = 3;

        fixture.componentInstance.onMacroPercentChange();

        expect(fixture.componentInstance.errors.length).toEqual(0);
    }));
});
