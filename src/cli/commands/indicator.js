import { register } from '../router.js';
import * as chartCore from '../../core/chart.js';
import * as indCore from '../../core/indicators.js';
import * as dataCore from '../../core/data.js';

register('indicator', {
  description: 'Indicator tools (add, remove, toggle, set, get)',
  subcommands: new Map([
    ['add', {
      description: 'Add an indicator to the chart',
      options: {
        inputs: { type: 'string', short: 'i', description: 'JSON input overrides' },
      },
      handler: (opts, positionals) => {
        if (!positionals[0]) throw new Error('Indicator name required. Usage: tv indicator add "Volume"');
        return chartCore.manageIndicator({ action: 'add', indicator: positionals.join(' '), inputs: opts.inputs });
      },
    }],
    ['remove', {
      description: 'Remove an indicator by entity ID',
      handler: (opts, positionals) => {
        if (!positionals[0]) throw new Error('Entity ID required. Usage: tv indicator remove eFu1Ot');
        return chartCore.manageIndicator({ action: 'remove', indicator: '', entity_id: positionals[0] });
      },
    }],
    ['toggle', {
      description: 'Show or hide an indicator',
      options: {
        visible: { type: 'boolean', description: 'Show (true) or hide (false)' },
        hidden: { type: 'boolean', description: 'Hide the indicator' },
      },
      handler: (opts, positionals) => {
        if (!positionals[0]) throw new Error('Entity ID required. Usage: tv indicator toggle eFu1Ot --visible');
        const visible = opts.hidden ? false : (opts.visible !== undefined ? opts.visible : true);
        return indCore.toggleVisibility({ entity_id: positionals[0], visible });
      },
    }],
    ['set', {
      description: 'Change indicator input values',
      options: {
        inputs: { type: 'string', short: 'i', description: 'JSON input overrides, e.g. \'{"length": 50}\'' },
      },
      handler: (opts, positionals) => {
        if (!positionals[0]) throw new Error('Entity ID required. Usage: tv indicator set eFu1Ot -i \'{"in_3": 20}\'');
        if (!opts.inputs) throw new Error('Inputs required. Usage: tv indicator set eFu1Ot -i \'{"in_3": 20}\'');
        return indCore.setInputs({ entity_id: positionals[0], inputs: opts.inputs });
      },
    }],
    ['get', {
      description: 'Get indicator info and inputs',
      handler: (opts, positionals) => {
        if (!positionals[0]) throw new Error('Entity ID required. Usage: tv indicator get eFu1Ot');
        return dataCore.getIndicator({ entity_id: positionals[0] });
      },
    }],
  ]),
});
