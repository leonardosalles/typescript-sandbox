/**
 * Generic Stack implementation using a singly linked list.
 * LIFO (Last In, First Out) data structure.
 *
 * Time Complexity:
 *   push  -> O(1)
 *   pop   -> O(1)
 *   peek  -> O(1)
 *   size  -> O(1)
 *
 * Space Complexity: O(n)
 */
interface Node<T> {
  data: T;
  next: Node<T> | null;
}

export class EmptyStackError extends Error {
  constructor() {
    super("Stack is empty");
    this.name = "EmptyStackError";
  }
}

export class Stack<T> {
  private top: Node<T> | null = null;
  private _size: number = 0;

  /**
   * Pushes an element onto the top of the stack.
   * @throws {TypeError} if item is null or undefined
   */
  push(item: T): void {
    if (item === null || item === undefined) {
      throw new TypeError("Null or undefined elements are not allowed");
    }
    const newNode: Node<T> = { data: item, next: this.top };
    this.top = newNode;
    this._size++;
  }

  /**
   * Removes and returns the element at the top of the stack.
   * @throws {EmptyStackError} if the stack is empty
   */
  pop(): T {
    if (this.isEmpty()) throw new EmptyStackError();
    const data = this.top!.data;
    this.top = this.top!.next;
    this._size--;
    return data;
  }

  /**
   * Returns (without removing) the element at the top of the stack.
   * @throws {EmptyStackError} if the stack is empty
   */
  peek(): T {
    if (this.isEmpty()) throw new EmptyStackError();
    return this.top!.data;
  }

  /** Returns true if the stack contains no elements. */
  isEmpty(): boolean {
    return this._size === 0;
  }

  /** Returns the number of elements in the stack. */
  get size(): number {
    return this._size;
  }

  /** Removes all elements from the stack. */
  clear(): void {
    this.top = null;
    this._size = 0;
  }

  /**
   * Returns true if the stack contains the given item.
   * Uses strict equality (===). O(n).
   */
  contains(item: T): boolean {
    let current = this.top;
    while (current !== null) {
      if (current.data === item) return true;
      current = current.next;
    }
    return false;
  }

  [Symbol.iterator](): Iterator<T> {
    let current = this.top;
    return {
      next(): IteratorResult<T> {
        if (current !== null) {
          const value = current.data;
          current = current.next;
          return { value, done: false };
        }
        return { value: undefined as unknown as T, done: true };
      },
    };
  }

  /** Returns an array snapshot from top to bottom. */
  toArray(): T[] {
    const result: T[] = [];
    for (const item of this) {
      result.push(item);
    }
    return result;
  }

  toString(): string {
    if (this.isEmpty()) return "Stack[]";
    return `Stack[top -> ${this.toArray().join(", ")}]`;
  }
}
