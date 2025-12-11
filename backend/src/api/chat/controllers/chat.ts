import { factories } from '@strapi/strapi';
import { detectIntentAndRespond, extractSavingsGoal } from '../../../services/agents';
import { buildBudgetSummary } from '../../analysis/controllers/budget-utils';

export default factories.createCoreController('api::chat.chat', ({ strapi }) => ({
  async respond(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('Login erforderlich');
    }

    const { history = [], message } = ctx.request.body || {};
    const summary = await buildBudgetSummary(strapi, user.id);
    const goalsRaw = await strapi.entityService.findMany('api::savings-goal.savings-goal', {
      filters: { user: user.id },
      sort: { targetDate: 'asc' },
    });
    const goals: any[] = Array.isArray(goalsRaw) ? goalsRaw : goalsRaw ? [goalsRaw] : [];

    const result = await detectIntentAndRespond({ history, message, goals, summary }, async (goalText) => {
      const parsed = await extractSavingsGoal(goalText);
      const goal = await strapi.entityService.create('api::savings-goal.savings-goal', {
        data: { ...parsed, user: user.id },
      });
      const updatedGoals = (await strapi.entityService.findMany('api::savings-goal.savings-goal', {
        filters: { user: user.id },
        sort: { targetDate: 'asc' },
      })) as any[];
      return { goal, goals: updatedGoals };
    });

    const goalsToReturn = (result as any).goals ?? goals;
    ctx.body = { ...result, goals: goalsToReturn, summary };
  },
}));
