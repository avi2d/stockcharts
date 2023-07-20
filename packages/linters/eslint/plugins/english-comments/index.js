/** @type {import('eslint').Rule.RuleModule} */
const rule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Please comment it with english',
    },
    schema: [],
  },
  create: function (context) {
    const sourceCode = context.getSourceCode();

    return {
      Program() {
        const comments = sourceCode.getAllComments();
        comments
          .filter(token => token.type !== 'Shebang')
          .forEach(node => {
            if (node.value === '') return;

            if (/^[\x21-\x7e-A-Za-z0-9\s]+$/g.test(node.value) === false) {
              context.report(node, 'Please comment it with english');
            }
          });
      },
    };
  },
};

module.exports = {
  rules: {
    'english-comments': rule,
  },
};
