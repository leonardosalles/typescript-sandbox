import { describe, it, expect, beforeEach } from "vitest";
import { Stack, EmptyStackError } from "../src/stack";

describe("Stack<T>", () => {
  let stack: Stack<number>;

  beforeEach(() => {
    stack = new Stack<number>();
  });

  describe("isEmpty() and size", () => {
    it("new stack is empty and has size 0", () => {
      expect(stack.isEmpty()).toBe(true);
      expect(stack.size).toBe(0);
    });

    it("size grows with each push", () => {
      stack.push(1);
      expect(stack.size).toBe(1);
      stack.push(2);
      expect(stack.size).toBe(2);
      stack.push(3);
      expect(stack.size).toBe(3);
    });

    it("size shrinks with each pop", () => {
      stack.push(10);
      stack.push(20);
      stack.pop();
      expect(stack.size).toBe(1);
      stack.pop();
      expect(stack.size).toBe(0);
      expect(stack.isEmpty()).toBe(true);
    });
  });

  describe("push()", () => {
    it("push single element -> stack not empty", () => {
      stack.push(42);
      expect(stack.isEmpty()).toBe(false);
      expect(stack.size).toBe(1);
    });

    it("push null throws TypeError", () => {
      const s = new Stack<string>();
      expect(() => s.push(null as unknown as string)).toThrow(TypeError);
    });

    it("push undefined throws TypeError", () => {
      const s = new Stack<string>();
      expect(() => s.push(undefined as unknown as string)).toThrow(TypeError);
    });

    it.each([1, 100, -5, 0, Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER])(
      "push %i and peek returns same value",
      (value) => {
        stack.push(value);
        expect(stack.peek()).toBe(value);
      },
    );
  });

  describe("pop()", () => {
    it("pop returns top element (LIFO order)", () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);

      expect(stack.pop()).toBe(3);
      expect(stack.pop()).toBe(2);
      expect(stack.pop()).toBe(1);
    });

    it("pop on empty stack throws EmptyStackError", () => {
      expect(() => stack.pop()).toThrow(EmptyStackError);
    });

    it("pop decreases size by 1", () => {
      stack.push(5);
      stack.push(10);
      stack.pop();
      expect(stack.size).toBe(1);
    });

    it("pop all elements leaves stack empty", () => {
      stack.push(1);
      stack.push(2);
      stack.pop();
      stack.pop();
      expect(stack.isEmpty()).toBe(true);
    });
  });

  describe("peek()", () => {
    it("peek returns top without removing", () => {
      stack.push(99);
      expect(stack.peek()).toBe(99);
      expect(stack.size).toBe(1);
    });

    it("peek on empty stack throws EmptyStackError", () => {
      expect(() => stack.peek()).toThrow(EmptyStackError);
    });

    it("peek reflects latest push", () => {
      stack.push(1);
      stack.push(2);
      expect(stack.peek()).toBe(2);
      stack.push(3);
      expect(stack.peek()).toBe(3);
    });
  });

  describe("clear()", () => {
    it("clear empties the stack", () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);
      stack.clear();
      expect(stack.isEmpty()).toBe(true);
      expect(stack.size).toBe(0);
    });

    it("clear then push works normally", () => {
      stack.push(7);
      stack.clear();
      stack.push(42);
      expect(stack.size).toBe(1);
      expect(stack.peek()).toBe(42);
    });
  });

  describe("contains()", () => {
    it("returns true for existing element", () => {
      stack.push(10);
      stack.push(20);
      expect(stack.contains(10)).toBe(true);
      expect(stack.contains(20)).toBe(true);
    });

    it("returns false for absent element", () => {
      stack.push(10);
      expect(stack.contains(99)).toBe(false);
    });

    it("returns false on empty stack", () => {
      expect(stack.contains(1)).toBe(false);
    });
  });

  describe("Symbol.iterator", () => {
    it("iterates top-to-bottom", () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);

      const result = [...stack];
      expect(result).toEqual([3, 2, 1]);
    });

    it("empty stack iterates zero times", () => {
      expect([...stack]).toEqual([]);
    });

    it("for-of loop works correctly", () => {
      stack.push(10);
      stack.push(20);
      const visited: number[] = [];
      for (const val of stack) visited.push(val);
      expect(visited).toEqual([20, 10]);
    });
  });

  describe("toArray()", () => {
    it("returns snapshot top-to-bottom", () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);
      expect(stack.toArray()).toEqual([3, 2, 1]);
    });

    it("returns empty array for empty stack", () => {
      expect(stack.toArray()).toEqual([]);
    });
  });

  describe("toString()", () => {
    it("empty stack representation", () => {
      expect(stack.toString()).toBe("Stack[]");
    });

    it("single element", () => {
      stack.push(5);
      expect(stack.toString()).toBe("Stack[top -> 5]");
    });

    it("multiple elements shown top first", () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);
      expect(stack.toString()).toBe("Stack[top -> 3, 2, 1]");
    });
  });

  describe("Generic type support", () => {
    it("works with string type", () => {
      const s = new Stack<string>();
      s.push("hello");
      s.push("world");
      expect(s.pop()).toBe("world");
      expect(s.pop()).toBe("hello");
    });

    it("works with boolean type", () => {
      const s = new Stack<boolean>();
      s.push(true);
      s.push(false);
      expect(s.pop()).toBe(false);
      expect(s.pop()).toBe(true);
    });

    it("works with object type", () => {
      type Point = { x: number; y: number };
      const s = new Stack<Point>();
      const p1 = { x: 1, y: 2 };
      const p2 = { x: 3, y: 4 };
      s.push(p1);
      s.push(p2);
      expect(s.pop()).toBe(p2);
      expect(s.pop()).toBe(p1);
    });
  });
});
