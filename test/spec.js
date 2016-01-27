/*jshint node:true, mocha:true */

'use strict';

require('should');

var sy = require('../src/shunt');
var shunt = sy.parse;

describe('shunt', function() {
  it('parses mathematical expressions', function() {
    shunt('3+2').should.be.exactly(5);
    shunt('(10+5)/5').should.be.exactly(3);
    shunt('2*(2*(5-3))').should.be.exactly(8);
    shunt('+7+2').should.be.exactly(9);
    shunt('7*+2').should.be.exactly(14);
    shunt('4(6)').should.be.exactly(24);
    shunt('3+(5*2)*(-3+2)').should.be.exactly(-7);
    shunt('1+2^3').should.be.exactly(9);
    shunt('9^.5').should.be.exactly(3);
    shunt('11%3').should.be.exactly(2);
    shunt('√1024').should.be.exactly(32);
    shunt('!3').should.be.exactly(false);
    shunt('!0').should.be.exactly(true);

    shunt.bind(undefined, '*').should.throw();
    shunt.bind(undefined, ')').should.throw();
    shunt.bind(undefined, '()').should.throw();
    shunt.bind(undefined, '(2+3').should.throw();
    shunt.bind(undefined, '10&5').should.throw();
    shunt.bind(undefined, '10/0').should.throw();
    shunt.bind(undefined, '10%0').should.throw();
  });

  it('supports adding math functions to the context', function() {
    shunt('2*(-3)').should.be.exactly(-6);

    var context = new sy.Context();
    context.def('abs');

    shunt('2*abs(-3)', context).should.be.exactly(6);

    shunt.bind(undefined, '2*abs(-3)').should.throw();
  });

  it('supports adding constants to the context', function() {
    var context = new sy.Context();

    context.def('tau', 2 * Math.PI);

    shunt('3*tau', context).should.be.exactly(3 * 2 * Math.PI);

    shunt.bind(undefined, '3*tau').should.throw();
  });

  it('supports adding arbitrary functions', function() {
    var context = new sy.Context();

    context.def('plus', function(a, b) {
      return a + b;
    });

    shunt('plus(2,3)', context).should.be.exactly(5);

    shunt.bind(undefined, 'javier(21)').should.throw();
  });
});
