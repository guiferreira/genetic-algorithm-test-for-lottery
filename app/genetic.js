class Chromosome  {
    constructor(list){
        this.list = list || [];
    }

    getList() {
        return this.list;
    }

    getFitness() {
        return this.fitness;
    }

    setFitness(value) {
        this.fitness = value;
    }
}

class Gene {
    constructor(min, max){
        this.min = min || 0;
        this.max = max || 10;
    }

    getGene() {
        return Math.floor(Math.random() * this.max) + this.min;
    }
}

class Genetic {
    constructor(qtd, length, filters, objective){
        this.qtd = qtd || 100;
        this.length = length || 100;
        this.filters = filters || [];
        this.objective = objective || this.filters.length;
    }

    initPopulation() {
        let population = [];
        let geneObject = new Gene(1, 60);
        for (let i = 0; i < this.qtd; i++) {
            let chromosome = [];
            for (let g = 0; g < this.length; g++) {
                chromosome.push(geneObject.getGene());
            }
            chromosome.sort(function order(a, b){
                return a - b;
            });
            population.push(new Chromosome(chromosome));
        }
        this.population = population;
        return population;
    }

    crossover() {
        this.population.sort(function comp(a, b) {
            return b.fitness - a.fitness;
        });
        let list = this.population;
        let population = [];
        for (let i = 0; i < list.length; i++) {
            for (let j = 1; j < list.length; j++) {
                let chromosome = list[i].getList().slice(0, parseInt(list[i].getList().length / 2)).concat(list[j].getList().slice(parseInt(list[j].getList().length / 2), list[j].getList().length));
                chromosome.sort(function order(a, b){
                    return a - b;
                });
                population.push(new Chromosome(chromosome))
            }
        }

        this.population = population.slice(0, this.qtd);

    }

    getPopulation() {
        return this.population;
    }

    fitnessCalculation() {
        for (let chromosome of this.population) {
            let fitness = 0;
            for (let filter of this.filters) {
                fitness += filter(chromosome);
            }
            chromosome.setFitness(fitness);
        }
        return this.population;
    }

    getResult() {
        let terminate = false;
        let list = [];
        for (let item of this.population) {
            if (item.fitness >= this.objective) {
                terminate = true;
                list.push(item);
            }
        }
        if (terminate) {
            return list;
        }

        return false;
    }
}


function filterPrimeNumbers(chromosome) {
   let list = chromosome.getList();
   let max = 3;
   let count = 0;
   for (let gene of list) {
       let isPrime = true;
       for(let i = 2; i < gene; i++)
           if(gene % i === 0) isPrime = false;
       if(gene > 1 && isPrime) {
           count++;
       }
   }
   if (count > max) {
       return 0;
   }

   return 1;
}

function filterRepeatedNumbers(chromosome) {
    let list = chromosome.getList();
    for (let gene of list) {
        let count = 0;
        for (let num of list) {
            if (gene === num ) {
                count++;
            }
        }
        if (count > 1) {
            return 0;
        }
    }

    return 1;
}

function main() {
    let genetic = new Genetic(10, 6, [filterPrimeNumbers, filterRepeatedNumbers]);
    genetic.initPopulation();
    genetic.fitnessCalculation();
    let qnt = 0;
    let end = false;
    while (qnt < 50 && !end) {
        if (genetic.getResult()){
            end = true;
        } else {
            genetic.crossover();
            genetic.fitnessCalculation();
            qnt++;
        }
    }
    console.log(genetic.getResult());
    document.getElementById('Lottery').innerHTML = '';
    for (let item of genetic.getResult()) {
        let number = '';
        for (let j of item.getList()){
            if (number === '')
                number += '' + j;
            else
                number += ' - ' + j;

        }
        document.getElementById('Lottery').innerHTML += `<p>${number}</p>`;
    }


}

main();