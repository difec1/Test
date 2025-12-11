export default async (ctx, next) => {
  if (!ctx.state.user) {
    return ctx.unauthorized('Login erforderlich');
  }
  return next();
};
