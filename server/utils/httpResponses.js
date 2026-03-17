export const ok = (res, data = {}, status = 200) => {
  return res.status(status).json({ ok: true, ...data });
};

export const fail = (res, status, message, extra = {}) => {
  return res.status(status).json({ ok: false, message, ...extra });
};
