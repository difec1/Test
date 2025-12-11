import { factories } from '@strapi/strapi';
import { normalizeIncomingTransaction, classifyImpulse } from '../../../services/agents';
import { buildBudgetSummary } from '../../analysis/controllers/budget-utils';

export default factories.createCoreController('api::transaction.transaction', ({ strapi }) => ({
  async analyzeAndCreate(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('Login erforderlich');
    }

    const body = ctx.request.body;
    const normalized = await normalizeIncomingTransaction(body);
    const kaggleExamples = await strapi.service('api::transaction.transaction').getKaggleExamples?.();
    const classification = await classifyImpulse(normalized, kaggleExamples || []);

    const entry = await strapi.entityService.create('api::transaction.transaction', {
      data: {
        ...normalized,
        ...classification,
        user: user.id,
        source: 'user',
      },
      populate: ['user'],
    });

    const summary = await buildBudgetSummary(strapi, user.id);

    ctx.body = { transaction: entry, summary };
  },

  async userTransactions(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('Login erforderlich');
    }

    const entries = await strapi.entityService.findMany('api::transaction.transaction', {
      filters: { user: user.id },
      sort: { date: 'desc' },
    });

    ctx.body = entries;
  },
}));
