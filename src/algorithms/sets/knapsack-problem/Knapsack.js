import MergeSort from '../../sorting/merge-sort/MergeSort';
import recordStep from '../../../utils/trace/recordStep';

export default class Knapsack {
  /**
   * @param {KnapsackItem[]} possibleItems
   * @param {number} weightLimit
   */
  constructor(possibleItems, weightLimit) {
    this.selectedItems = [];
    this.weightLimit = weightLimit;
    this.possibleItems = possibleItems;
  }

  sortPossibleItemsByWeight() {
    this.possibleItems = new MergeSort({
      /**
       * @var KnapsackItem itemA
       * @var KnapsackItem itemB
       */
      compareCallback: (itemA, itemB) => {
        if (itemA.weight === itemB.weight) {
          return 0;
        }

        return itemA.weight < itemB.weight ? -1 : 1;
      },
    }).sort(this.possibleItems);
  }

  sortPossibleItemsByValue() {
    this.possibleItems = new MergeSort({
      /**
       * @var KnapsackItem itemA
       * @var KnapsackItem itemB
       */
      compareCallback: (itemA, itemB) => {
        if (itemA.value === itemB.value) {
          return 0;
        }

        return itemA.value > itemB.value ? -1 : 1;
      },
    }).sort(this.possibleItems);
  }

  sortPossibleItemsByValuePerWeightRatio() {
    this.possibleItems = new MergeSort({
      /**
       * @var KnapsackItem itemA
       * @var KnapsackItem itemB
       */
      compareCallback: (itemA, itemB) => {
        if (itemA.valuePerWeightRatio === itemB.valuePerWeightRatio) {
          return 0;
        }

        return itemA.valuePerWeightRatio > itemB.valuePerWeightRatio ? -1 : 1;
      },
    }).sort(this.possibleItems);
  }

  // Solve 0/1 knapsack by prefix items and integer capacity, then trace selected rows.
  solveZeroOneKnapsackProblem(stepCallback) {
    this.sortPossibleItemsByValue();
    this.sortPossibleItemsByWeight();
    this.selectedItems = [];
    const knapsackMatrix = Array(this.possibleItems.length + 1).fill(null)
      .map(() => Array(this.weightLimit + 1).fill(null));
    knapsackMatrix[0].fill(0);
    for (let itemIndex = 1; itemIndex <= this.possibleItems.length; itemIndex += 1) {
      knapsackMatrix[itemIndex][0] = 0;
    }
    recordStep(stepCallback, 'initialize', [], [], () => ({
      dpMatrix: JSON.stringify(knapsackMatrix), selected: '[]',
    }), 'knapsackMatrix[0].fill(0);');

    for (let itemIndex = 1; itemIndex <= this.possibleItems.length; itemIndex += 1) {
      const item = this.possibleItems[itemIndex - 1];
      for (let weightIndex = 1; weightIndex <= this.weightLimit; weightIndex += 1) {
        const skip = knapsackMatrix[itemIndex - 1][weightIndex];
        if (item.weight > weightIndex) {
          knapsackMatrix[itemIndex][weightIndex] = skip;
          recordStep(stepCallback, 'too-heavy', [], [], () => ({
            dpMatrix: JSON.stringify(knapsackMatrix),
            row: itemIndex,
            column: weightIndex,
            skip,
            itemWeight: item.weight,
            itemValue: item.value,
            dependencies: JSON.stringify([[itemIndex - 1, weightIndex]]),
          }), 'knapsackMatrix[itemIndex][weightIndex] = skip;');
        } else {
          const take = item.value + knapsackMatrix[itemIndex - 1][weightIndex - item.weight];
          knapsackMatrix[itemIndex][weightIndex] = Math.max(skip, take);
          recordStep(stepCallback, 'choose-value', [], [], () => ({
            dpMatrix: JSON.stringify(knapsackMatrix),
            row: itemIndex,
            column: weightIndex,
            skip,
            take,
            itemWeight: item.weight,
            itemValue: item.value,
            dependencies: JSON.stringify([
              [itemIndex - 1, weightIndex], [itemIndex - 1, weightIndex - item.weight],
            ]),
          }), 'knapsackMatrix[itemIndex][weightIndex] = Math.max(skip, take);');
        }
      }
    }

    let weightIndex = this.weightLimit;
    for (let itemIndex = this.possibleItems.length; itemIndex > 0; itemIndex -= 1) {
      const item = this.possibleItems[itemIndex - 1];
      if (knapsackMatrix[itemIndex][weightIndex] > knapsackMatrix[itemIndex - 1][weightIndex]) {
        item.quantity = 1;
        this.selectedItems.push(item);
        recordStep(stepCallback, 'take-item', [], [], () => ({
          row: itemIndex,
          column: weightIndex,
          itemWeight: item.weight,
          itemValue: item.value,
          selected: JSON.stringify(this.selectedItems.map((selected) => {
            return this.possibleItems.indexOf(selected) + 1;
          })),
          dependencies: JSON.stringify([[itemIndex - 1, weightIndex - item.weight]]),
        }), 'this.selectedItems.push(item);');
        weightIndex -= item.weight;
      } else {
        recordStep(stepCallback, 'skip-item', [], [], () => ({
          row: itemIndex,
          column: weightIndex,
          dependencies: JSON.stringify([[itemIndex - 1, weightIndex]]),
        }), 'if (knapsackMatrix[itemIndex][weightIndex] > knapsackMatrix[itemIndex - 1][weightIndex]) {');
      }
    }
  }

  // Solve unbounded knapsack problem.
  // Greedy approach.
  solveUnboundedKnapsackProblem() {
    this.sortPossibleItemsByValue();
    this.sortPossibleItemsByValuePerWeightRatio();

    for (let itemIndex = 0; itemIndex < this.possibleItems.length; itemIndex += 1) {
      if (this.totalWeight < this.weightLimit) {
        const currentItem = this.possibleItems[itemIndex];

        // Detect how much of current items we can push to knapsack.
        const availableWeight = this.weightLimit - this.totalWeight;
        const maxPossibleItemsCount = Math.floor(availableWeight / currentItem.weight);

        if (maxPossibleItemsCount > currentItem.itemsInStock) {
          // If we have more items in stock then it is allowed to add
          // let's add the maximum allowed number of them.
          currentItem.quantity = currentItem.itemsInStock;
        } else if (maxPossibleItemsCount) {
          // In case if we don't have specified number of items in stock
          // let's add only items we have in stock.
          currentItem.quantity = maxPossibleItemsCount;
        }

        this.selectedItems.push(currentItem);
      }
    }
  }

  get totalValue() {
    /** @var {KnapsackItem} item */
    return this.selectedItems.reduce((accumulator, item) => {
      return accumulator + item.totalValue;
    }, 0);
  }

  get totalWeight() {
    /** @var {KnapsackItem} item */
    return this.selectedItems.reduce((accumulator, item) => {
      return accumulator + item.totalWeight;
    }, 0);
  }
}
