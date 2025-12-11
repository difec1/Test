import { factories } from '@strapi/strapi';
import { buildBudgetSummary } from './budget-utils';

export default factories.createCoreController('api::analysis.analysis', ({ strapi }) => ({
  async summary(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('Login erforderlich');
    }

    const summary = await buildBudgetSummary(strapi, user.id);

    const goals = await strapi.entityService.findMany('api::savings-goal.savings-goal', {
      filters: { user: user.id },
      sort: { targetDate: 'asc' },
    });

    ctx.body = { summary, goals };
  },
}));
