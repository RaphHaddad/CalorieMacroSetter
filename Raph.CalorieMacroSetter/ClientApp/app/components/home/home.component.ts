
import { Component } from '@angular/core';

@Component({
    selector: 'home',
    templateUrl: './home.component.html'
})
export class HomeComponent {
    totalCalories = 0;
    carbs = new CarbAndProtein(40);
    protein = new CarbAndProtein(30);
    fat = new Fat(30);

    public pieChartLabels: string[] = ['Protein', 'Fat', 'Protein'];
    public pieChartData: number[] = [300, 500, 100];

    public onTotalCaloriesChange(): void {
        this.carbs.setGramsAndCaloriesBasedOnPercent(this.totalCalories);
        this.protein.setGramsAndCaloriesBasedOnPercent(this.totalCalories);
        this.fat.setGramsAndCaloriesBasedOnPercent(this.totalCalories);
    }

    public onMacroGramsChange() {
        this.totalCalories = this.calculateTotalCalories();
        this.carbs.adjustPercentageBasedOnGrams(this.totalCalories);
        this.protein.adjustPercentageBasedOnGrams(this.totalCalories);
        this.fat.adjustPercentageBasedOnGrams(this.totalCalories);
    }

    private calculateTotalCalories() {
        let caloriesFromC = this.carbs.grams * 4;
        let caloriesFromP = this.protein.grams * 4;
        let caloriesFromF = this.fat.grams * 9;
        return caloriesFromC + caloriesFromF + caloriesFromP;
    }
}

class Macro {
    public grams = 0;
    public percent = 0;

    constructor(percent: number) {
        this.percent = percent;
    }

    public setGramsAndCaloriesBasedOnPercent(totalCalories: number) {
    }

    public adjustPercentageBasedOnGrams(totalCalories: number) {
        
    }
}

class CarbAndProtein extends Macro {
    public setGramsAndCaloriesBasedOnPercent(totalCalories: number) {
        let calories = totalCalories * (this.percent / 100);
        this.grams = calories / 4;
    }

    public adjustPercentageBasedOnGrams(totalCalories: number) {
        let calories = this.grams * 4;
        this.percent = calories / totalCalories * 100;
    }
}

class Fat extends Macro {
    public setGramsAndCaloriesBasedOnPercent(totalCalories: number) {
        let calories = totalCalories * (this.percent / 100);
        this.grams = calories / 9;
    }

    public adjustPercentageBasedOnGrams(totalCalories: number) {
        let calories = this.grams * 9;
        this.percent = calories / totalCalories * 100;
    }
}