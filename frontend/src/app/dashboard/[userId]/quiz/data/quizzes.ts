
import { QuestionType, QuizSchedule } from '../types';

// Helper function to add days to a date
const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Get today's date at midnight
const today = new Date();
today.setHours(0, 0, 0, 0);

// Create mock quizzes
export const quizzes: QuizSchedule[] = [
  {
    id: 'quiz-1',
    name: 'JavaScript Fundamentals',
    description: 'Test your knowledge of JavaScript basics including variables, functions, and control flow.',
    scheduledDate: today,
    duration: 30,
    questions: [
      {
        id: 'js-1',
        text: 'Which keyword is used to declare a variable in JavaScript that cannot be reassigned?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['var', 'let', 'const', 'static'],
        correctAnswer: 'const'
      },
      {
        id: 'js-2',
        text: 'What will the following code output?\nconsole.log(typeof []);',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['array', 'object', 'undefined', 'null'],
        correctAnswer: 'object'
      },
      {
        id: 'js-3',
        text: 'Which method is used to add an element to the end of an array?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['push()', 'append()', 'addToEnd()', 'concat()'],
        correctAnswer: 'push()'
      },
      {
        id: 'js-4',
        text: 'What is the correct way to write a function in JavaScript?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          'function myFunction() {}',
          'function = myFunction() {}',
          'function:myFunction() {}',
          'myFunction => function() {}'
        ],
        correctAnswer: 'function myFunction() {}'
      },
      {
        id: 'js-5',
        text: 'What does the "===" operator do in JavaScript?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          'Assigns a value',
          'Compares values for equality with type conversion',
          'Compares values for equality without type conversion',
          'Compares memory references'
        ],
        correctAnswer: 'Compares values for equality without type conversion'
      },
      {
        id: 'js-6',
        text: 'What is the term for a function that takes another function as an argument?',
        type: QuestionType.TEXT_INPUT,
        correctAnswer: 'higher order function'
      },
      {
        id: 'js-7',
        text: 'What built-in method can be used to convert a JSON string to a JavaScript object?',
        type: QuestionType.TEXT_INPUT,
        correctAnswer: 'JSON.parse'
      },
      {
        id: 'js-8',
        text: 'What is the output of: console.log(2 + "2")?',
        type: QuestionType.TEXT_INPUT,
        correctAnswer: '22'
      },
      {
        id: 'js-9',
        text: 'Which method is used to remove the last element from an array?',
        type: QuestionType.TEXT_INPUT,
        correctAnswer: 'pop'
      },
      {
        id: 'js-10',
        text: 'In JavaScript, what is a closure?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          'A way to close a browser window',
          'A function that has access to variables from its outer function scope',
          'A method to end a loop early',
          'A security feature that prevents access to private variables'
        ],
        correctAnswer: 'A function that has access to variables from its outer function scope'
      }
    ]
  },
  {
    id: 'quiz-2',
    name: 'TypeScript Essentials',
    description: 'Cover the fundamentals of TypeScript including types, interfaces, and generics.',
    scheduledDate: today,
    duration: 30,
    questions: [
      {
        id: 'ts-1',
        text: 'What is TypeScript?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          'A database management system',
          'A JavaScript library',
          'A superset of JavaScript that adds static typing',
          'A programming language unrelated to JavaScript'
        ],
        correctAnswer: 'A superset of JavaScript that adds static typing'
      },
      {
        id: 'ts-2',
        text: 'Which of these types is not a built-in type in TypeScript?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['string', 'boolean', 'integer', 'any'],
        correctAnswer: 'integer'
      },
      {
        id: 'ts-3',
        text: 'What is the correct syntax for defining an interface in TypeScript?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          'type Person {}',
          'interface Person {}',
          'class Person {}',
          'define Person {}'
        ],
        correctAnswer: 'interface Person {}'
      },
      {
        id: 'ts-4',
        text: 'How do you define an optional property in a TypeScript interface?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          'name?: string',
          'name: string | undefined',
          'name: optional string',
          'name: maybe string'
        ],
        correctAnswer: 'name?: string'
      },
      {
        id: 'ts-5',
        text: 'What symbol is used to indicate a union type in TypeScript?',
        type: QuestionType.TEXT_INPUT,
        correctAnswer: '|'
      },
      {
        id: 'ts-6',
        text: 'What is the file extension for TypeScript files?',
        type: QuestionType.TEXT_INPUT,
        correctAnswer: '.ts'
      },
      {
        id: 'ts-7',
        text: 'Which TypeScript feature allows you to create a type that can work with a variety of data types?',
        type: QuestionType.TEXT_INPUT,
        correctAnswer: 'generics'
      },
      {
        id: 'ts-8',
        text: 'What command is typically used to compile TypeScript code?',
        type: QuestionType.TEXT_INPUT,
        correctAnswer: 'tsc'
      },
      {
        id: 'ts-9',
        text: 'Which TypeScript type is used to represent a function that doesn\'t return a value?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['undefined', 'void', 'null', 'never'],
        correctAnswer: 'void'
      },
      {
        id: 'ts-10',
        text: 'What is the purpose of the "as" keyword in TypeScript?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          'Loop control',
          'Import libraries',
          'Type assertion',
          'Error handling'
        ],
        correctAnswer: 'Type assertion'
      }
    ]
  },
  {
    id: 'quiz-3',
    name: 'React Fundamentals',
    description: 'Test your knowledge of React core concepts including components, state, and props.',
    scheduledDate: addDays(today, 1),
    duration: 30,
    questions: [
      {
        id: 'react-1',
        text: 'What is React?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          'A JavaScript library for building user interfaces',
          'A server-side programming language',
          'A database management system',
          'A full-stack web framework'
        ],
        correctAnswer: 'A JavaScript library for building user interfaces'
      },
      {
        id: 'react-2',
        text: 'Which of the following is used to pass data from a parent component to a child component?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['State', 'Props', 'Context', 'Hooks'],
        correctAnswer: 'Props'
      },
      {
        id: 'react-3',
        text: 'What hook is used to manage state in functional components?',
        type: QuestionType.TEXT_INPUT,
        correctAnswer: 'useState'
      },
      {
        id: 'react-4',
        text: 'What is the name of the React hook used for side effects?',
        type: QuestionType.TEXT_INPUT,
        correctAnswer: 'useEffect'
      },
      {
        id: 'react-5',
        text: 'What is JSX?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          'A JavaScript XML syntax extension',
          'A state management library',
          'A React component pattern',
          'A testing framework for React'
        ],
        correctAnswer: 'A JavaScript XML syntax extension'
      },
      {
        id: 'react-6',
        text: 'What method is used to render a React component?',
        type: QuestionType.TEXT_INPUT,
        correctAnswer: 'render'
      },
      {
        id: 'react-7',
        text: 'What is the correct lifecycle method that is called after a component is rendered for the first time?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          'componentWillMount',
          'componentDidMount',
          'componentWillUpdate',
          'componentDidUpdate'
        ],
        correctAnswer: 'componentDidMount'
      },
      {
        id: 'react-8',
        text: 'What is a "key" prop used for in React lists?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          'To style list items differently',
          'To help React identify which items have changed, added, or removed',
          'To bind events to list items',
          'To create unique URLs for each list item'
        ],
        correctAnswer: 'To help React identify which items have changed, added, or removed'
      },
      {
        id: 'react-9',
        text: 'What is the purpose of React Context?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          'To manage routing in React applications',
          'To optimize performance with memoization',
          'To pass data through the component tree without props drilling',
          'To handle form submissions'
        ],
        correctAnswer: 'To pass data through the component tree without props drilling'
      },
      {
        id: 'react-10',
        text: 'What is the React library used for routing?',
        type: QuestionType.TEXT_INPUT,
        correctAnswer: 'react-router'
      }
    ]
  },
  {
    id: 'quiz-4',
    name: 'Web Performance Optimization',
    description: 'Learn about techniques to optimize web performance for better user experience.',
    scheduledDate: addDays(today, 2),
    duration: 30,
    questions: [
      {
        id: 'perf-1',
        text: 'What does "lazy loading" refer to in web development?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          'Loading resources only when needed',
          'Slow website performance',
          'A debugging technique',
          'A design pattern for databases'
        ],
        correctAnswer: 'Loading resources only when needed'
      },
      {
        id: 'perf-2',
        text: 'Which of these file formats typically provides the best compression for photographs on the web?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['PNG', 'SVG', 'JPEG', 'GIF'],
        correctAnswer: 'JPEG'
      },
      {
        id: 'perf-3',
        text: 'What does CDN stand for in the context of web performance?',
        type: QuestionType.TEXT_INPUT,
        correctAnswer: 'Content Delivery Network'
      },
      {
        id: 'perf-4',
        text: 'Which of the following is NOT a benefit of code splitting?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          'Reduced initial load time',
          'Smaller bundle sizes',
          'Improved SEO rankings',
          'Increased security'
        ],
        correctAnswer: 'Increased security'
      },
      {
        id: 'perf-5',
        text: 'What technique involves combining multiple CSS or JavaScript files into one to reduce HTTP requests?',
        type: QuestionType.TEXT_INPUT,
        correctAnswer: 'bundling'
      },
      {
        id: 'perf-6',
        text: 'Which browser API allows you to measure the performance of your web application?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          'Navigator API',
          'Performance API',
          'Metrics API',
          'Timing API'
        ],
        correctAnswer: 'Performance API'
      },
      {
        id: 'perf-7',
        text: 'What does TTFB stand for in web performance metrics?',
        type: QuestionType.TEXT_INPUT,
        correctAnswer: 'Time To First Byte'
      },
      {
        id: 'perf-8',
        text: 'Which of the following is a valid strategy for improving web performance?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          'Using unoptimized images',
          'Inlining all CSS and JavaScript',
          'Implementing resource hints like preload and prefetch',
          'Avoiding caching'
        ],
        correctAnswer: 'Implementing resource hints like preload and prefetch'
      },
      {
        id: 'perf-9',
        text: 'What performance metric measures the time until the page becomes interactive?',
        type: QuestionType.TEXT_INPUT,
        correctAnswer: 'Time to Interactive'
      },
      {
        id: 'perf-10',
        text: 'Which file type is best suited for simple icons and logos on the web?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['JPEG', 'PNG', 'SVG', 'BMP'],
        correctAnswer: 'SVG'
      }
    ]
  },
  {
    id: 'quiz-5',
    name: 'CSS Grid and Flexbox',
    description: 'Test your knowledge of modern CSS layout techniques.',
    scheduledDate: addDays(today, 3),
    duration: 30,
    questions: [
      {
        id: 'css-1',
        text: 'Which CSS property defines columns in a grid layout?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          'grid-template-columns',
          'grid-columns',
          'grid-column-template',
          'column-grid-template'
        ],
        correctAnswer: 'grid-template-columns'
      },
      {
        id: 'css-2',
        text: 'In Flexbox, which value of the "justify-content" property aligns items at the center?',
        type: QuestionType.TEXT_INPUT,
        correctAnswer: 'center'
      },
      {
        id: 'css-3',
        text: 'Which CSS property is used to specify the size of a grid track?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          'grid-size',
          'grid-track-size',
          'grid-template-columns',
          'grid-auto-columns'
        ],
        correctAnswer: 'grid-template-columns'
      },
      {
        id: 'css-4',
        text: 'In Flexbox, what property is used to control the alignment of items on the cross axis?',
        type: QuestionType.TEXT_INPUT,
        correctAnswer: 'align-items'
      },
      {
        id: 'css-5',
        text: 'What CSS function is used to create flexible grids with equally sized columns?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['repeat()', 'flex()', 'equal()', 'size()'],
        correctAnswer: 'repeat()'
      },
      {
        id: 'css-6',
        text: 'Which value of the "display" property creates a flex container?',
        type: QuestionType.TEXT_INPUT,
        correctAnswer: 'flex'
      },
      {
        id: 'css-7',
        text: 'What is the default value of the "flex-direction" property?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['row', 'column', 'row-reverse', 'column-reverse'],
        correctAnswer: 'row'
      },
      {
        id: 'css-8',
        text: 'Which unit is used to create flexible grid tracks that grow and shrink?',
        type: QuestionType.TEXT_INPUT,
        correctAnswer: 'fr'
      },
      {
        id: 'css-9',
        text: 'What CSS property is used to create gaps between grid items?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          'grid-gap',
          'gap',
          'grid-spacing',
          'item-gap'
        ],
        correctAnswer: 'gap'
      },
      {
        id: 'css-10',
        text: 'In Flexbox, which property allows flex items to grow if necessary?',
        type: QuestionType.TEXT_INPUT,
        correctAnswer: 'flex-grow'
      }
    ]
  },  
  {
    id: 'quiz-6',
    name: 'Java Fundamentals',
    description: 'Test your knowledge of Java basics including OOP, data types, and control structures.',
    scheduledDate: today,
    duration: 30,
    questions: [
      {
        id: 'java-1',
        text: 'Which keyword is used to define a class in Java?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['class', 'Class', 'define', 'struct'],
        correctAnswer: 'class'
      },
      {
        id: 'java-2',
        text: 'Which data type is used to store a single character in Java?',
        type: QuestionType.TEXT_INPUT,
        correctAnswer: 'char'
      },
      {
        id: 'java-3',
        text: 'What is the default value of a boolean variable in Java?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['true', 'false', '0', 'null'],
        correctAnswer: 'false'
      },
      {
        id: 'java-4',
        text: 'Which method is called automatically when an object is created?',
        type: QuestionType.TEXT_INPUT,
        correctAnswer: 'constructor'
      },
      {
        id: 'java-5',
        text: 'What is the keyword used for inheritance in Java?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['extends', 'implements', 'inherits', 'derives'],
        correctAnswer: 'extends'
      },
      {
        id: 'java-6',
        text: 'What is the main purpose of the "final" keyword in Java?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          'To define a constant',
          'To mark a method that cannot be overridden',
          'To prevent class inheritance',
          'All of the above'
        ],
        correctAnswer: 'All of the above'
      },
      {
        id: 'java-7',
        text: 'Which package is imported by default in every Java program?',
        type: QuestionType.TEXT_INPUT,
        correctAnswer: 'java.lang'
      },
      {
        id: 'java-8',
        text: 'Which exception is thrown when a division by zero occurs in Java?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['ArithmeticException', 'NullPointerException', 'IOException', 'RuntimeException'],
        correctAnswer: 'ArithmeticException'
      },
      {
        id: 'java-9',
        text: 'What is the return type of the "main" method in Java?',
        type: QuestionType.TEXT_INPUT,
        correctAnswer: 'void'
      },
      {
        id: 'java-10',
        text: 'Which collection type does not allow duplicate elements?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['List', 'Set', 'Map', 'Queue'],
        correctAnswer: 'Set'
      }
    ]
  },
  {
    id: 'quiz-7',
    name: 'Python Fundamentals',
    description: 'Test your understanding of Python syntax, data structures, and core concepts.',
    scheduledDate: addDays(today, 1),
    duration: 30,
    questions: [
      {
        id: 'python-1',
        text: 'Which symbol is used for single-line comments in Python?',
        type: QuestionType.TEXT_INPUT,
        correctAnswer: '#'
      },
      {
        id: 'python-2',
        text: 'What is the output of: print(type([]))?',
        type: QuestionType.TEXT_INPUT,
        correctAnswer: "<class 'list'>"
      },
      {
        id: 'python-3',
        text: 'Which keyword is used to define a function in Python?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['func', 'def', 'define', 'function'],
        correctAnswer: 'def'
      },
      {
        id: 'python-4',
        text: 'Which data structure does not allow duplicate values?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['List', 'Tuple', 'Set', 'Dictionary'],
        correctAnswer: 'Set'
      },
      {
        id: 'python-5',
        text: 'What is the correct way to open a file in Python for reading?',
        type: QuestionType.TEXT_INPUT,
        correctAnswer: "open('filename', 'r')"
      },
      {
        id: 'python-6',
        text: 'Which built-in function returns the length of an object?',
        type: QuestionType.TEXT_INPUT,
        correctAnswer: 'len'
      },
      {
        id: 'python-7',
        text: 'How do you create a dictionary in Python?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          "dict = {'key': 'value'}",
          "dict = ['key', 'value']",
          "dict = ('key', 'value')",
          "dict = {'key', ['value']}"
        ],
        correctAnswer: "dict = {'key': 'value'}"
      },
      {
        id: 'python-8',
        text: 'Which Python library is commonly used for data analysis?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['NumPy', 'Django', 'Flask', 'Matplotlib'],
        correctAnswer: 'NumPy'
      },
      {
        id: 'python-9',
        text: 'What does the "pass" statement do in Python?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          'Skips the rest of the loop',
          'Defines a placeholder for future code',
          'Terminates the function',
          'Repeats the last statement'
        ],
        correctAnswer: 'Defines a placeholder for future code'
      },
      {
        id: 'python-10',
        text: 'What will be the output of: print(bool(""))?',
        type: QuestionType.TEXT_INPUT,
        correctAnswer: 'False'
      }
    ]
  }
];