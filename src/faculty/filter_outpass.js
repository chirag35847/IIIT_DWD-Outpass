export default function categorizeOutpassesByRoleAndStatus(objects, role) {
  const pending = [];
  const rejected = [];
  const granted = [];

  objects.forEach((object) => {
    const outpassData = object.outpassData;

    if (role === "Faculty") {
      if (outpassData.status === "pending") {
        pending.push(object);
      } else if (outpassData.status === "faculty_rejected") {
        rejected.push(object);
      } else if (outpassData.status === "approved") {
        granted.push(object);
      }
    } else if (role === "SWC") {
      if (outpassData.status === "pending") {
        pending.push(object);
      } else if (outpassData.status === "swc_rejected") {
        rejected.push(object);
      } else {
        granted.push(object);
      }
    } else if (role === "Warden") {
      if (outpassData.status === "swc_accepted") {
        pending.push(object);
      } else if (outpassData.status === "warden_rejected") {
        rejected.push(object);
      } else {
        granted.push(object);
      }
    }
  });

  return { pending, rejected, granted };
}