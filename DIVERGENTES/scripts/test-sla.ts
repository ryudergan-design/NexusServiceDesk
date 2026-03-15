import { calculateSLA } from './src/lib/sla';
import { format } from 'date-fns';

// Teste 1: Sexta 17:30 + 120 minutos
const fridayStart = new Date('2026-03-13T17:30:00'); // Sexta-feira
const result = calculateSLA(fridayStart, 120);

console.log('--- Teste de SLA ---');
console.log('Início:', format(fridayStart, 'yyyy-MM-dd HH:mm (EEEE)'));
console.log('Adicionado: 120 minutos');
console.log('Resultado:', format(result, 'yyyy-MM-dd HH:mm (EEEE)'));

const expected = '2026-03-14 10:30 (Saturday)';
const actual = format(result, 'yyyy-MM-dd HH:mm (EEEE)');

if (actual === expected) {
  console.log('STATUS: SUCESSO');
} else {
  console.log('STATUS: FALHA');
  console.log('Esperado:', expected);
}
