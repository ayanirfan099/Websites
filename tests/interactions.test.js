const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function load(page, elements) {
  const html = fs.readFileSync(path.join(__dirname, '..', page), 'utf8');
  const context = vm.createContext({document: {getElementById: id => elements[id]}});
  for (const match of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)) {
    vm.runInContext(match[1], context);
  }
  return context;
}
const fields = {num1: {value: '1.5'}, num2: {value: '2.25'}, result: {style: {}}};
const calculator = load('calculator.html', fields);
calculator.calculate();
assert.equal(fields.result.textContent, 'Result: 3.75');
for (const bad of ['', 'Infinity', 'not a number']) {
  fields.num1.value = bad;
  calculator.calculate();
  assert.equal(fields.result.textContent, 'Please enter valid numbers.');
}
fields.num1.value = '1e308'; fields.num2.value = '1e308';
calculator.calculate();
assert.equal(fields.result.textContent, 'Please enter valid numbers.');

let submit;
const formFields = {
  registrationForm: {addEventListener: (event, callback) => {if (event === 'submit') submit = callback;}},
  email: {value: 'demo@example.com', checkValidity: () => true},
  password: {value: 'example-only'},
  status: {}
};
const form = load('form-validation.html', formFields);
assert.equal(form.validateForm(), true);
assert.match(formFields.status.textContent, /does not create an account/);
let prevented = false;
submit({preventDefault: () => {prevented = true;}});
assert.equal(prevented, true);
formFields.password.value = '123';
assert.equal(form.validateForm(), false);
formFields.password.value = 'example-only';
formFields.email.checkValidity = () => false;
assert.equal(form.validateForm(), false);
formFields.email.value = '';
assert.equal(form.validateForm(), false);
console.log('Calculator and form interaction checks passed.');

// The footer is parsed after the inline script; the year must wait for DOM readiness.
const nodes = {};
function element() {
  return {children: [], style: {}, appendChild(child) {this.children.push(child);},
    set id(value) {nodes[value] = this;}};
}
const container = element();
let ready;
const university = vm.createContext({document: {
  querySelector: () => container,
  createElement: element,
  getElementById: id => nodes[id],
  addEventListener: (event, callback) => {if (event === 'DOMContentLoaded') ready = callback;}
}});
const universityHtml = fs.readFileSync(path.join(__dirname, '..', 'university-program.html'), 'utf8');
for (const match of universityHtml.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)) {
  vm.runInContext(match[1], university);
}
assert.equal(container.children.length, 8);
university.toggleCourses(0);
assert.equal(nodes.semester0.style.display, 'block');
university.toggleCourses(0);
assert.equal(nodes.semester0.style.display, 'none');
nodes.year = {};
ready();
assert.equal(nodes.year.textContent, new Date().getFullYear());
console.log('Semester toggle and deferred footer checks passed.');
