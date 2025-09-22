export function handle(resPromise) {
  return resPromise.then((r) => r.data);
}
