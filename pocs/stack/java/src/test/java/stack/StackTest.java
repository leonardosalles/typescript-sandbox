package stack;

import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import java.util.EmptyStackException;
import java.util.Iterator;
import java.util.NoSuchElementException;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Stack<T> — Unit Tests")
class StackTest {

    private Stack<Integer> stack;

    @BeforeEach
    void setUp() {
        stack = new Stack<>();
    }

    @Nested
    @DisplayName("isEmpty() and size()")
    class IsEmptyAndSize {

        @Test
        @DisplayName("new stack is empty and has size 0")
        void newStackIsEmpty() {
            assertTrue(stack.isEmpty());
            assertEquals(0, stack.size());
        }

        @Test
        @DisplayName("size grows with each push")
        void sizeGrowsWithPush() {
            stack.push(1);
            assertEquals(1, stack.size());
            stack.push(2);
            assertEquals(2, stack.size());
            stack.push(3);
            assertEquals(3, stack.size());
        }

        @Test
        @DisplayName("size shrinks with each pop")
        void sizeShrinks() {
            stack.push(10);
            stack.push(20);
            stack.pop();
            assertEquals(1, stack.size());
            stack.pop();
            assertEquals(0, stack.size());
            assertTrue(stack.isEmpty());
        }
    }

    @Nested
    @DisplayName("push()")
    class Push {

        @Test
        @DisplayName("push single element -> stack not empty")
        void pushSingleElement() {
            stack.push(42);
            assertFalse(stack.isEmpty());
            assertEquals(1, stack.size());
        }

        @Test
        @DisplayName("push null throws IllegalArgumentException")
        void pushNullThrows() {
            Stack<String> strStack = new Stack<>();
            assertThrows(IllegalArgumentException.class, () -> strStack.push(null));
        }

        @ParameterizedTest(name = "push {0}")
        @ValueSource(ints = {1, 100, -5, 0, Integer.MAX_VALUE, Integer.MIN_VALUE})
        @DisplayName("push various integers")
        void pushVariousIntegers(int value) {
            stack.push(value);
            assertEquals(value, stack.peek());
        }
    }

    @Nested
    @DisplayName("pop()")
    class Pop {

        @Test
        @DisplayName("pop returns top element (LIFO order)")
        void popReturnsLIFO() {
            stack.push(1);
            stack.push(2);
            stack.push(3);

            assertEquals(3, stack.pop());
            assertEquals(2, stack.pop());
            assertEquals(1, stack.pop());
        }

        @Test
        @DisplayName("pop on empty stack throws EmptyStackException")
        void popEmptyThrows() {
            assertThrows(EmptyStackException.class, () -> stack.pop());
        }

        @Test
        @DisplayName("pop decreases size by 1")
        void popDecreasesSizeByOne() {
            stack.push(5);
            stack.push(10);
            stack.pop();
            assertEquals(1, stack.size());
        }

        @Test
        @DisplayName("pop all elements leaves stack empty")
        void popAllLeavesEmpty() {
            stack.push(1);
            stack.push(2);
            stack.pop();
            stack.pop();
            assertTrue(stack.isEmpty());
        }
    }

    @Nested
    @DisplayName("peek()")
    class Peek {

        @Test
        @DisplayName("peek returns top without removing")
        void peekDoesNotRemove() {
            stack.push(99);
            assertEquals(99, stack.peek());
            assertEquals(1, stack.size());
        }

        @Test
        @DisplayName("peek on empty stack throws EmptyStackException")
        void peekEmptyThrows() {
            assertThrows(EmptyStackException.class, () -> stack.peek());
        }

        @Test
        @DisplayName("peek reflects latest push")
        void peekReflectsLatestPush() {
            stack.push(1);
            stack.push(2);
            assertEquals(2, stack.peek());
            stack.push(3);
            assertEquals(3, stack.peek());
        }
    }

    @Nested
    @DisplayName("clear()")
    class Clear {

        @Test
        @DisplayName("clear empties the stack")
        void clearEmptiesStack() {
            stack.push(1);
            stack.push(2);
            stack.push(3);
            stack.clear();
            assertTrue(stack.isEmpty());
            assertEquals(0, stack.size());
        }

        @Test
        @DisplayName("clear then push works normally")
        void clearThenPush() {
            stack.push(7);
            stack.clear();
            stack.push(42);
            assertEquals(1, stack.size());
            assertEquals(42, stack.peek());
        }
    }

    @Nested
    @DisplayName("contains()")
    class Contains {

        @Test
        @DisplayName("returns true for existing element")
        void containsExisting() {
            stack.push(10);
            stack.push(20);
            assertTrue(stack.contains(10));
            assertTrue(stack.contains(20));
        }

        @Test
        @DisplayName("returns false for absent element")
        void containsAbsent() {
            stack.push(10);
            assertFalse(stack.contains(99));
        }

        @Test
        @DisplayName("returns false on empty stack")
        void containsOnEmptyStack() {
            assertFalse(stack.contains(1));
        }
    }

    @Nested
    @DisplayName("iterator()")
    class IteratorTests {

        @Test
        @DisplayName("iterates top-to-bottom")
        void iteratesTopToBottom() {
            stack.push(1);
            stack.push(2);
            stack.push(3);

            int[] expected = {3, 2, 1};
            int i = 0;
            for (int val : stack) {
                assertEquals(expected[i++], val);
            }
        }

        @Test
        @DisplayName("iterator on empty stack — hasNext is false immediately")
        void emptyIterator() {
            Iterator<Integer> it = stack.iterator();
            assertFalse(it.hasNext());
        }

        @Test
        @DisplayName("calling next() past end throws NoSuchElementException")
        void iteratorExhausted() {
            stack.push(1);
            Iterator<Integer> it = stack.iterator();
            it.next();
            assertThrows(NoSuchElementException.class, it::next);
        }
    }

    @Nested
    @DisplayName("toString()")
    class ToStringTests {

        @Test
        @DisplayName("empty stack representation")
        void toStringEmpty() {
            assertEquals("Stack[]", stack.toString());
        }

        @Test
        @DisplayName("single element")
        void toStringSingle() {
            stack.push(5);
            assertEquals("Stack[top -> 5]", stack.toString());
        }

        @Test
        @DisplayName("multiple elements shown top first")
        void toStringMultiple() {
            stack.push(1);
            stack.push(2);
            stack.push(3);
            assertEquals("Stack[top -> 3, 2, 1]", stack.toString());
        }
    }

    @Nested
    @DisplayName("Generic type support")
    class Generics {

        @Test
        @DisplayName("works with String type")
        void worksWithString() {
            Stack<String> strStack = new Stack<>();
            strStack.push("hello");
            strStack.push("world");
            assertEquals("world", strStack.pop());
            assertEquals("hello", strStack.pop());
        }

        @Test
        @DisplayName("works with Double type")
        void worksWithDouble() {
            Stack<Double> dblStack = new Stack<>();
            dblStack.push(3.14);
            dblStack.push(2.71);
            assertEquals(2.71, dblStack.peek(), 1e-10);
        }

        @Test
        @DisplayName("works with custom object type")
        void worksWithCustomObject() {
            record Point(int x, int y) {}
            Stack<Point> pointStack = new Stack<>();
            pointStack.push(new Point(1, 2));
            pointStack.push(new Point(3, 4));
            assertEquals(new Point(3, 4), pointStack.pop());
        }
    }
}
