package stack;

import java.util.EmptyStackException;
import java.util.Iterator;
import java.util.NoSuchElementException;

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
 *
 * @param <T> the type of elements held in this stack
 */
public class Stack<T> implements Iterable<T> {
    private static class Node<T> {
        T data;
        Node<T> next;

        Node(T data) {
            this.data = data;
        }
    }

    private Node<T> top;
    private int size;


    /**
     * Pushes an element onto the top of the stack.
     * @param item element to push
     * @throws IllegalArgumentException if item is null
     */
    public void push(T item) {
        if (item == null) throw new IllegalArgumentException("Null elements are not allowed");
        Node<T> newNode = new Node<>(item);
        newNode.next = top;
        top = newNode;
        size++;
    }

    /**
     * Removes and returns the element at the top of the stack.
     * @return the top element
     * @throws EmptyStackException if the stack is empty
     */
    public T pop() {
        if (isEmpty()) throw new EmptyStackException();
        T data = top.data;
        top = top.next;
        size--;
        return data;
    }

    /**
     * Returns (without removing) the element at the top of the stack.
     * @return the top element
     * @throws EmptyStackException if the stack is empty
     */
    public T peek() {
        if (isEmpty()) throw new EmptyStackException();
        return top.data;
    }

    /**
     * Returns true if the stack contains no elements.
     */
    public boolean isEmpty() {
        return size == 0;
    }

    /**
     * Returns the number of elements in the stack.
     */
    public int size() {
        return size;
    }

    /**
     * Removes all elements from the stack.
     */
    public void clear() {
        top = null;
        size = 0;
    }

    /**
     * Returns true if the stack contains the specified element.
     * O(n) linear scan.
     */
    public boolean contains(T item) {
        Node<T> current = top;
        while (current != null) {
            if (current.data.equals(item)) return true;
            current = current.next;
        }
        return false;
    }

    @Override
    public Iterator<T> iterator() {
        return new Iterator<>() {
            private Node<T> current = top;

            @Override
            public boolean hasNext() {
                return current != null;
            }

            @Override
            public T next() {
                if (!hasNext()) throw new NoSuchElementException();
                T data = current.data;
                current = current.next;
                return data;
            }
        };
    }

    @Override
    public String toString() {
        if (isEmpty()) return "Stack[]";
        StringBuilder sb = new StringBuilder("Stack[top -> ");
        Node<T> current = top;
        while (current != null) {
            sb.append(current.data);
            if (current.next != null) sb.append(", ");
            current = current.next;
        }
        return sb.append("]").toString();
    }
}
