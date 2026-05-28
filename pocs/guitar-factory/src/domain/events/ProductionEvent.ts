import { BuildStage } from "../GuitarTypes";

export type ProductionEvent = {
  serial: string;
  stage: BuildStage;
  message: string;
  progress: number;
};

export interface ProductionObserver {
  update(event: ProductionEvent): void;
}

export class ProductionLineEvents {
  private readonly observers = new Set<ProductionObserver>();

  subscribe(observer: ProductionObserver): () => void {
    this.observers.add(observer);
    return () => this.observers.delete(observer);
  }

  publish(event: ProductionEvent): void {
    this.observers.forEach((observer) => observer.update(event));
  }
}
