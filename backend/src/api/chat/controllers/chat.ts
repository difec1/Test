import { factories } from '@strapi/strapi';
import { detectIntentAndRespond } from '../../../services/agents';
import { buildBudgetSummary } from '../../analysis/controllers/budget-utils';

export default factories.createCoreController('api::chat.chat', ({ strapi }) => ({
  async respond(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('Login erforderlich');
    }

    const { history = [], message } = ctx.request.body || {};
    const summary = await buildBudgetSummary(strapi, user.id);
    const goals = await strapi.entityService.findMany('api::savings-goal.savings-goal', {
      filters: { user: user.id },
      sort: { targetDate: 'asc' },
    });

    const result = await detectIntentAndRespond({ history, message, goals, summary }, async (goalText) => {
      const created = await strapi.controller('api::savings-goal.savings-goal').fromText({
        ...ctx,
        request: { body: { text: goalText } },
      });
      return created?.goal ?? null;
    });

    ctx.body = { ...result, goals, summary };
  },
}));
