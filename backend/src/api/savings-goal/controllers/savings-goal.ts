import { factories } from '@strapi/strapi';
import { extractSavingsGoal } from '../../../services/agents';

export default factories.createCoreController('api::savings-goal.savings-goal', ({ strapi }) => ({
  async fromText(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('Login erforderlich');
    }

    const { text } = ctx.request.body;
    const parsed = await extractSavingsGoal(text);

    const goal = await strapi.entityService.create('api::savings-goal.savings-goal', {
      data: {
        ...parsed,
        user: user.id,
      },
    });

    const goals = await strapi.entityService.findMany('api::savings-goal.savings-goal', {
      filters: { user: user.id },
      sort: { targetDate: 'asc' },
    });

    ctx.body = { goal, goals };
  },

  async userGoals(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('Login erforderlich');
    }

    const goals = await strapi.entityService.findMany('api::savings-goal.savings-goal', {
      filters: { user: user.id },
      sort: { targetDate: 'asc' },
    });

    ctx.body = goals;
  },
}));
