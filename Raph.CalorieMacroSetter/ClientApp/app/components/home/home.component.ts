import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

    totalCalories: number;
    carbs: CarbAndProtein;
    protein: CarbAndProtein;
    fat: Fat;
    errors = new Array<CalculationError>();

    public chartLabels: string[] = ['Protein', 'Fat', 'Carbs'];
    public chartData: number[] = [300, 500, 100];
    public isBrowser = false;

    ngOnInit(): void {
        this.totalCalories = 2000;
        this.carbs = new CarbAndProtein(40);
        this.protein = new CarbAndProtein(30);
        this.fat = new Fat(30);
        this.onTotalCaloriesChange();
        this.drawGraph();
    }

    public onTotalCaloriesChange(): void {
        this.errors = [];
        this.carbs.setGramsAndCaloriesBasedOnPercent(this.totalCalories);
        this.protein.setGramsAndCaloriesBasedOnPercent(this.totalCalories);
        this.fat.setGramsAndCaloriesBasedOnPercent(this.totalCalories);
        this.drawGraph();
    }

    public onMacroGramsChange() {
        this.errors = [];
        this.totalCalories = this.calculateTotalCalories();
        this.carbs.adjustPercentageBasedOnGrams(this.totalCalories);
        this.protein.adjustPercentageBasedOnGrams(this.totalCalories);
        this.fat.adjustPercentageBasedOnGrams(this.totalCalories);
        this.drawGraph();
    }

    public onMacroPercentChange() {
        this.errors = [];
        let totalPercent = this.protein.percent + this.carbs.percent + this.fat.percent;
        if (totalPercent !== 100) {
            let addOrTakeAway = totalPercent < 100 ? "add" : "take away";
            let number = Math.abs(totalPercent - 100);
            this.errors.push(new CalculationError("percent", `The total percent should be 100. You currently have ${totalPercent}, so you need to ${addOrTakeAway} ${number}%`));
            return;
        }
        this.carbs.adjustGramsBasedOnPercentage(this.totalCalories);
        this.protein.adjustGramsBasedOnPercentage(this.totalCalories);
        this.fat.adjustGramsBasedOnPercentage(this.totalCalories);
        this.drawGraph();
    }

    public hasPercentError(): boolean {
        return this.errors.some(x => x.type === "percent");
    }

    private drawGraph() {
        var newData = [];
        newData[0] = this.protein.percent;
        newData[1] = this.fat.percent;
        newData[2] = this.carbs.percent;
        this.chartData = newData;
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

    public adjustGramsBasedOnPercentage(totalCalories: number) {
        
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

    public adjustGramsBasedOnPercentage(totalCalories: number) {
        let calories = (this.percent / 100) * totalCalories;
        this.grams = calories / 4;
    }
}

class CalculationError {
    public type: string;
    public message: string;
    constructor(type: string, message: string) {
        this.type = type;
        this.message = message;
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

    public adjustGramsBasedOnPercentage(totalCalories: number) {
        let calories = (this.percent / 100) * totalCalories;
        this.grams = calories / 9;
    }
}